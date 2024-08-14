import os
import argparse

def count_lines_and_characters_in_file(file_path):
    """Count the number of lines and characters in a given file, removing whitespaces."""
    line_count = 0
    char_count = 0
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            stripped_line = line.strip()  # Remove leading and trailing whitespaces
            if stripped_line:  # Only count non-empty lines
                line_count += 1
                char_count += len(stripped_line)
    return line_count, char_count

def total_lines_and_characters_in_directory(directory_path, file_extensions, script_name):
    """Count the total number of lines and characters in files with specified extensions in the given directory, excluding the script itself."""
    total_lines = 0
    total_characters = 0
    for root, _, files in os.walk(directory_path):
        for file in files:
            if file == script_name:
                continue  # Skip the script file itself
            if any(file.endswith(ext) for ext in file_extensions):
                file_path = os.path.join(root, file)
                try:
                    lines, characters = count_lines_and_characters_in_file(file_path)
                    total_lines += lines
                    total_characters += characters
                    print(f"File: {file_path} - Lines: {lines}, Characters: {characters}")
                except Exception as e:
                    print(f"Could not read file {file_path}: {e}")
    return total_lines, total_characters

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description="Count lines and characters in files with specified extensions.")
    parser.add_argument('-p', '--path', type=str, default=os.path.dirname(os.path.abspath(__file__)),
                        help="Path to the directory to scan (default: directory of this script)")
    args = parser.parse_args()

    # Specify the file types you want to include
    file_extensions = ['.js', '.css', '.html']  # Add more extensions as needed

    # Get the directory path and script name
    directory_path = args.path
    script_name = os.path.basename(__file__)  # Get the name of the current script

    total_lines, total_characters = total_lines_and_characters_in_directory(directory_path, file_extensions, script_name)
    print()
    print(" ************************** Total lines and characters ************************** ")
    print(f"Total number of lines in specified file types in the directory '{directory_path}': {total_lines}")
    print(f"Total number of characters in specified file types in the directory '{directory_path}': {total_characters}")

if __name__ == "__main__":
    main()
