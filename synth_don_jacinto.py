"""
Synth script for Don Jacinto's voice lines using Microsoft Edge Neural TTS (es-CO-GonzaloNeural).
"""
import asyncio
import edge_tts
import base64
import json
import os

DON_JACINTO_LINES = {
    "intro": (
        "¡Hola a todos! Soy Don Jacinto, campesino de estas hermosas montañas. "
        "Acompáñenme por este sendero de la memoria histórica. "
        "Juntos responderemos preguntas sobre el conflicto armado entre 1958 y 1978, "
        "aprenderemos sobre la verdad y reconstruiremos la Finca La Esperanza. ¡Bienvenidos!"
    ),
    "dice_1": "¡Tiremos los dados para ver qué nos depara el sendero!",
    "dice_2": "¡Vamos allá, tiremos el dado con fe y esperanza!",
    "dice_3": "¡A ver esos dados campesinos, a caminar por la memoria!",
    "correct_1": "¡Eso es, mi hermano! La verdad nos hace libres.",
    "correct_2": "¡Muy bien! Un paso más cerca de reconstruir la Finca La Esperanza.",
    "correct_3": "¡Excelente respuesta! La memoria de nuestros campesinos sigue viva.",
    "wrong_1": "No te desanimes, mijo. De los tropiezos aprendemos y seguimos adelante con el corazón.",
    "wrong_2": "Tranquilo, la historia es para reflexionar. ¡Sigamos con paso firme!",
    "wrong_3": "No te preocupes, la verdad requiere paciencia. ¡Vamos a la siguiente!",
    "star_bonus": "¡Qué alegría! Llegamos a una casilla de reflexión y memoria histórica. ¡Puntos dobles para la finca!",
    "victory": (
        "¡Bendito sea Dios! ¡Hemos llegado a la Finca La Esperanza y la hemos reconstruido juntos! "
        "Gracias por honrar la memoria y la verdad de Colombia. ¡Viva el campo colombiano!"
    ),
    "game_over": (
        "Se nos acabaron las vidas, pero nunca la esperanza. "
        "Recuerda que la memoria histórica nunca se rinde. ¡Volvamos a intentarlo!"
    )
}

async def generate_jacinto_voices():
    os.makedirs('assets/audio_tts', exist_ok=True)
    os.makedirs('assets/datos', exist_ok=True)
    
    b64_dict = {}
    print(f"Synthesizing {len(DON_JACINTO_LINES)} lines for Don Jacinto using es-CO-GonzaloNeural...")
    
    for key, text in DON_JACINTO_LINES.items():
        mp3_path = f"assets/audio_tts/{key}.mp3"
        communicate = edge_tts.Communicate(text, 'es-CO-GonzaloNeural', rate='+3%')
        await communicate.save(mp3_path)
        
        with open(mp3_path, 'rb') as f:
            b64_str = base64.b64encode(f.read()).decode('utf-8')
            b64_dict[key] = f"data:audio/mp3;base64,{b64_str}"
        print(f"  [+] Synthesized '{key}' ({os.path.getsize(mp3_path)} bytes)")

    with open('assets/datos/gonzalo_voice_b64.json', 'w', encoding='utf-8') as f:
        json.dump(b64_dict, f, ensure_ascii=False, indent=2)

    print("All Don Jacinto voice lines synthesized and saved in assets/datos/gonzalo_voice_b64.json!")

if __name__ == '__main__':
    asyncio.run(generate_jacinto_voices())
