import ast
from mcp.server.fastmcp import FastMCP
mcp = FastMCP("Code Tools")
@mcp.tool()
def analyze_python_code(code: str) -> str:
    """Analyze Python code for syntax errors and basic code information."""
    try:
        tree = ast.parse(code)
        functions = [
            node.name
            for node in ast.walk(tree)
            if isinstance(node, ast.FunctionDef)
        ]
        classes = [
            node.name
            for node in ast.walk(tree)
            if isinstance(node, ast.ClassDef)
        ]
        return (
            "Syntax: Valid\n"
            f"Functions: {functions}\n"
            f"Classes: {classes}\n"
            f"Lines: {len(code.splitlines())}"
        )

    except SyntaxError as error:
        return (
            "Syntax: Invalid\n"
            f"Error: {error.msg}\n"
            f"Line: {error.lineno}"
        )
if __name__ == "__main__":
    mcp.run()