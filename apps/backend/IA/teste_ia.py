from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env")
import os
import anthropic

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

message = client.messages.create(
    model="claude-haiku-4-5-20251001",  
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "me sugira um treino para hipertrofia"}
    ]
)

print(message.content[0].text)