import asyncio
import edge_tts
import base64
import json
import os

async def main():
    with open('questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)

    print(f'Total questions to synthesize: {len(questions)}')
    os.makedirs('assets/audio_tts/questions', exist_ok=True)
    q_audio_b64 = {}

    for idx, q in enumerate(questions):
        cat = q.get('category', '')
        q_text = q.get('question', '')
        full_text = f"{cat}. {q_text}"
        communicate = edge_tts.Communicate(full_text, 'es-CO-GonzaloNeural', rate='+5%')
        path = f'assets/audio_tts/questions/q_{idx}.mp3'
        await communicate.save(path)
        with open(path, 'rb') as f_audio:
            b64 = base64.b64encode(f_audio.read()).decode('utf-8')
            q_audio_b64[str(idx)] = f"data:audio/mp3;base64,{b64}"
        if (idx + 1) % 10 == 0 or idx == len(questions) - 1:
            print(f"Synthesized {idx + 1}/{len(questions)} questions...")

    with open('assets/datos/questions_voice_b64.json', 'w', encoding='utf-8') as f:
        json.dump(q_audio_b64, f)
    print('All questions synthesized successfully!')

if __name__ == '__main__':
    asyncio.run(main())
