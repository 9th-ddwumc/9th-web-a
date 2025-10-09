import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                        <span className="text-4xl">🚀</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        환영합니다!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        지금 시작해보세요
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                    >
                     
                        회원가입
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                    
                        로그인
                    </button>
                </div>

                <div className="text-center text-sm text-gray-500 pt-4">
                    <p>회원가입하면 다양한 서비스를 이용할 수 있어요</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;