import os
import google.generativeai as genai
from flask import Flask, render_template, request, Response, session
import uuid # For secret key generation

app = Flask(__name__)
# 세션 사용을 위한 시크릿 키 설정 (실제 운영 환경에서는 안전하게 관리)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', str(uuid.uuid4()))

# API 키 설정 (환경 변수 사용 권장)
# os.environ['GOOGLE_API_KEY'] = 'YOUR_API_KEY' # 환경 변수 설정 예시
try:
    genai.configure(api_key="AIzaSyAhdo2NHUHS545zUgkC-6_ldKGUyzY5vAQ") # 직접 키 사용 (테스트용)
    # 모델 초기화 (요청하신 모델명으로 변경)
    model = genai.GenerativeModel('gemini-2.5-pro-exp-03-25')
except Exception as e:
    print(f"Error configuring GenerativeAI or initializing model: {e}")
    model = None # 모델 초기화 실패 시 None으로 설정

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.form.get('message')
    if not user_message:
        return "No message received", 400
    if model is None:
        return "Model not initialized", 500

    # 세션에서 대화 기록 가져오기 또는 초기화
    chat_history = session.get('chat_history', [])

    def generate():
        full_response_text = ""
        try:
            # 대화 기록을 사용하여 채팅 세션 시작
            chat_session = model.start_chat(history=chat_history)

            # Gemini API 호출: 메시지에 대한 스트리밍 응답 생성
            response = chat_session.send_message(
                user_message,
                stream=True,
                # generation_config=genai.types.GenerationConfig(...) # 필요시 설정 추가
            )
            # 스트리밍 응답을 청크 단위로 yield 합니다.
            for chunk in response:
                if chunk.parts:
                    chunk_text = chunk.text
                    full_response_text += chunk_text
                    yield chunk_text
                # 안전 등급 확인 (선택 사항)
                # if chunk.prompt_feedback.block_reason:
                #     yield f"\n[Blocked due to: {chunk.prompt_feedback.block_reason}]"

            # 대화 기록 업데이트 (사용자 메시지 및 모델 응답 추가)
            chat_history.append({"role": "user", "parts": [user_message]})
            chat_history.append({"role": "model", "parts": [full_response_text]})
            session['chat_history'] = chat_history # 세션에 저장

        except Exception as e:
            print(f"Error during Gemini API call: {e}")
            yield f"[Error generating response: {e}]"


    # 클라이언트에 스트리밍 응답 전송 (텍스트 스트림으로)
    return Response(generate(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(debug=True)
