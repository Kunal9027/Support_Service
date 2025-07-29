from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .AI_agent import chat_with_user

from django.http import JsonResponse


def ping(request):
    print("ping is ok")
    return JsonResponse({"status": "ok"})

@method_decorator(csrf_exempt, name='dispatch')
class ChatAPIView(APIView):
    def post(self, request, *args, **kwargs):
        user_input = request.data.get("message")
        session_id = request.data.get("session_id", "default-session")

        if not user_input:
            return Response({"error": "No message provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            bot_response = chat_with_user(user_input, session_id=session_id)
            return Response({"response": bot_response}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

