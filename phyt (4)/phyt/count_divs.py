import re

def main():
    with open('src/pages/UserDashboard.jsx', 'r', encoding='utf-8') as f:
        code = f.read()

    # Strip single-line comments
    code = re.sub(r'//.*', '', code)
    # Strip multi-line comments
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)

    lines = code.split('\n')
    start_line = 3993
    end_line = 5035
    
    subcode = "\n".join(lines[start_line-1:end_line])
    
    # We will find all <div and </div>
    open_divs = []
    close_divs = []
    
    # Simple search for open divs (let's use regex that matches <div with a boundary)
    for m in re.finditer(r'<div\b', subcode):
        # Find line number of this match
        line_num = start_line + subcode[:m.start()].count('\n')
        open_divs.append(line_num)
        
    for m in re.finditer(r'</div\b', subcode):
        line_num = start_line + subcode[:m.start()].count('\n')
        close_divs.append(line_num)
        
    print(f"Total <div: {len(open_divs)}")
    print(f"Total </div>: {len(close_divs)}")
    print(f"Difference (Open - Close): {len(open_divs) - len(close_divs)}")
    
    # Let's see the nesting stack of divs
    stack = []
    i = 0
    n = len(subcode)
    current_line = start_line
    in_string = None
    
    while i < n:
        char = subcode[i]
        if char == '\n':
            current_line += 1
            
        if in_string:
            if char == in_string:
                if subcode[i-1] != '\\':
                    in_string = None
            i += 1
            continue
            
        if char in ('"', "'", "`"):
            in_string = char
            i += 1
            continue
            
        if subcode[i:i+4] == '<div':
            # check if it's followed by space or >
            if i+4 < n and (subcode[i+4] in (' ', '>', '\n', '\t')):
                stack.append(current_line)
                i += 4
                continue
                
        if subcode[i:i+6] == '</div>':
            if stack:
                stack.pop()
            else:
                print(f"[{current_line}] ERROR: Extra </div> found!")
            i += 6
            continue
            
        i += 1
        
    print("\n--- Unmatched Open divs ---")
    for l in stack:
        print(f"div opened at line {l} was never closed")
    print(f"Total unmatched divs: {len(stack)}")

if __name__ == "__main__":
    main()
