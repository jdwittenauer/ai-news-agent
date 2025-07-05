from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather")

@mcp.tool()
async def get_weather(city: str, state: str) -> str:
    """
    Get weather forecast for a location.

    Args:
        city: Name of the city
        state: State abbreviation (e.g., 'CA' for California)
    """
    print(f"Tool 'get_weather' called with location: {city}, {state}")
    return f"The weather in {city}, {state} is 75 degrees and sunny."

if __name__ == "__main__":
    mcp.run(transport="streamable-http")