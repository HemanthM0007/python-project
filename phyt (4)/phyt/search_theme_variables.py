import re

def main():
    with open('src/pages/UserDashboard.jsx', 'r', encoding='utf-8') as f:
        code = f.read()

    lines = code.split('\n')
    
    print("--- Searching for theme/border variables ---")
    for idx, line in enumerate(lines, 1):
        if 'theme' in line.lower() or 'border' in line.lower():
            if 'const' in line or 'let' in line or 'useState' in line:
                safe_line = line.strip().encode('ascii', 'ignore').decode('ascii')
                print(f"[{idx}] {safe_line}")

if __name__ == "__main__":
    main()
