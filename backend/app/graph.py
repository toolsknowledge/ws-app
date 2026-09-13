from typing import TypedDict

from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.messages import HumanMessage
from langgraph.graph import StateGraph, START, END

from .agents import create_llm, reviewer_prompt, teacher_prompt


class CodeState(TypedDict):
    code: str
    tool_result: str
    review: str
    answer: str


async def build_graph():

    client = MultiServerMCPClient(
        {
            "code_tools": {
                "transport": "stdio",
                "command": "python",
                "args": ["/app/mcp_server/code_tools.py"],
            }
        }
    )

    tools = await client.get_tools()

    if not tools:
        raise RuntimeError("MCP server did not provide any tools.")

    analyze_tool = tools[0]

    llm = create_llm()


    async def reviewer_agent(state: CodeState):

        tool_result = await analyze_tool.ainvoke(
            {
                "code": state["code"]
            }
        )

        response = await llm.ainvoke(
            [
                HumanMessage(
                    content=reviewer_prompt(
                        state["code"],
                        tool_result
                    )
                )
            ]
        )

        return {
            "tool_result": tool_result,
            "review": response.content,
        }


    async def teacher_agent(state: CodeState):

        response = await llm.ainvoke(
            [
                HumanMessage(
                    content=teacher_prompt(
                        state["code"],
                        state["review"]
                    )
                )
            ]
        )

        return {
            "answer": response.content
        }


    builder = StateGraph(CodeState)

    builder.add_node(
        "reviewer",
        reviewer_agent
    )

    builder.add_node(
        "teacher",
        teacher_agent
    )

    builder.add_edge(
        START,
        "reviewer"
    )

    builder.add_edge(
        "reviewer",
        "teacher"
    )

    builder.add_edge(
        "teacher",
        END
    )

    return builder.compile()