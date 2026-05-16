import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace <a onclick="go('something')"> with <a href="#page-something" onclick="go('something')">
# We only add href if it doesn't already exist.
def repl_a(m):
    original = m.group(0)
    if 'href=' in original:
        return original
    # Extract the page id
    match = re.search(r"go\('([^']+)'\)", original)
    if match:
        page_id = match.group(1)
        # add href="#page-{page_id}"
        return original.replace('<a ', f'<a href="#page-{page_id}" ')
    return original

content = re.sub(r'<a\s+[^>]*onclick="go\([^>]+\)[^>]*>', repl_a, content)

# Replace <div class="blog-read-btn"...> with <a class="blog-read-btn"...>
def repl_div(m):
    original = m.group(0)
    match = re.search(r"openArticle\('([^']+)'\)", original)
    if match:
        article_id = match.group(1)
        res = original.replace('<div ', f'<a href="#article-{article_id}" ')
        return res
    return original

content = re.sub(r'<div\s+class="blog-read-btn"[^>]*>', repl_div, content)
content = re.sub(r'(<a href="#article-[^>]+>.*?)</div>', r'\1</a>', content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
