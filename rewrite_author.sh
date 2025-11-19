# ----------------------------------------------------------------------
# Command: Rewrite Commit History (Identity & Message Cleanup)
# ----------------------------------------------------------------------
# This script performs two actions in one run:
# 1. Identity Fix: Consolidates multiple Author Names (danielfleshler, Daniel)
#    into the canonical name (Daniel Fleshler).
# 2. Message Cleanup: Removes the "Co-Authored-By" and "🤖 Generated" lines
#    that were automatically added to the commit message bodies.

# **CRITICAL:** Ensure you have 'git-filter-repo' installed.
# **BACKUP:** Run 'git clone --mirror' before executing this script.

# --- 1. Define Canonical Identity (The final, desired identity) ---
CANONICAL_NAME="Daniel Fleshler"
CANONICAL_EMAIL="daniflesh49@gmail.com"

# --- 2. Names to be consolidated ---
# These are the names that will be changed to CANONICAL_NAME
NAME_ALIAS_1="danielfleshler"
NAME_ALIAS_2="Daniel"

# --- 3. Execute the history rewrite using a commit callback ---
# ADDING --force HERE to bypass the safety check
git filter-repo --force --commit-callback '
# --- Identity Fix Logic ---
name_alias_1 = b"'"$NAME_ALIAS_1"'"
name_alias_2 = b"'"$NAME_ALIAS_2"'"
canonical_name = b"'"$CANONICAL_NAME"'"
canonical_email = b"'"$CANONICAL_EMAIL"'"

# Check if author name is one of the aliases
if commit.author_name == name_alias_1 or commit.author_name == name_alias_2:
    # Rewrite the author and committer names and emails to the canonical identity
    commit.author_name = canonical_name
    commit.author_email = canonical_email
    commit.committer_name = canonical_name
    commit.committer_email = canonical_email

# --- Message Cleanup Logic ---
# Convert message bytes to lines, excluding the unwanted strings
new_message_lines = []
for line in commit.message.splitlines():
    # Check for lines containing the unwanted Claude tags
    if (b"Co-Authored-By: Claude" in line or
        b"Generated with [Claude Code]" in line or
        b"noreply@anthropic.com" in line):
        continue
    new_message_lines.append(line)

# Rejoin the lines to form the new commit message
commit.message = b"\n".join(new_message_lines)
'

echo "History rewrite complete (Identity and Message cleanup). You must now force push: 'git push --force --tags'"
# The filter-repo tool requires a force push to update the remote history.