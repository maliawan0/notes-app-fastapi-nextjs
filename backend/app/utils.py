"""
Utility functions for note processing
"""

import re
from typing import List

def extract_tags(content: str) -> List[str]:
    """
    Extract tags from note content
    Tags are in the format #tagname
    Returns a list of unique, lowercase tag names (without the #)
    """
    if not content:
        return []
    
    # Find all tags matching #word pattern
    tag_pattern = r'#[\w-]+'
    matches = re.findall(tag_pattern, content)
    
    # Remove # and convert to lowercase, then get unique values
    tags = list(set([tag[1:].lower() for tag in matches]))
    return tags

def extract_title(content: str) -> str:
    """
    Extract title from note content
    Uses the first line, removing markdown headers (#)
    """
    if not content:
        return "Untitled Note"
    
    lines = content.strip().split('\n')
    if not lines:
        return "Untitled Note"
    
    first_line = lines[0].strip()
    # Remove markdown headers (# ## ### etc.)
    first_line = re.sub(r'^#+\s*', '', first_line)
    
    # Limit to 50 characters
    if len(first_line) > 50:
        return first_line[:50] + "..."
    
    return first_line if first_line else "Untitled Note"

