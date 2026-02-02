'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Zap, 
  Target, 
  Award,
  ArrowRight, 
  Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = [
    { front: 'Hello', back: 'Xin chào', emoji: '👋' },
    { front: 'Learn', back: 'Học', emoji: '📚' },
    { front: 'Success', back: 'Thành công', emoji: '🎯' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Spaced Repetition (SM-2)',
      description: 'Thuật toán khoa học giúp bạn ghi nhớ lâu hơn với ít thời gian hơn',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Học nhanh, nhớ lâu',
      description: 'Tối ưu hóa quá trình học với flashcard thông minh',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Theo dõi tiến độ',
      description: 'Thống kê chi tiết giúp bạn nắm rõ quá trình học tập',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Award,
      title: 'Tùy chỉnh linh hoạt',
      description: 'Tạo bộ thẻ riêng, import/export dễ dàng',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: '1000+', label: 'Người dùng' },
    { value: 'SM-2', label: 'Algorithm' },
    { value: '100%', label: 'Miễn phí' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-4 sm:px-6 py-4 md:py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FlashLearn
              </span>
            </motion.div>
          </Link>
          
          <motion.button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đăng nhập
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24 md:mb-32">
            
            {/* Left Content */}
            <motion.div 
              className="space-y-6 md:space-y-8 text-center lg:text-left z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  🎓 Học từ vựng thông minh
                </span>
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Learn faster.{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Remember longer.
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Học từ vựng tiếng Anh hiệu quả với phương pháp Spaced Repetition (SM-2). 
                Ghi nhớ lâu hơn với ít thời gian hơn.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={() => router.push('/register')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Bắt đầu miễn phí</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  onClick={() => alert('Demo coming soon!')}
                  className="group px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Xem demo</span>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right 3D Cards */}
            <motion.div 
              className="relative h-[400px] sm:h-[450px] md:h-[500px] z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-sm perspective-1000">
                  <AnimatePresence mode="wait">
                    {flashcards.map((card, index) => {
                      const offset = index - currentCard;
                      const absOffset = Math.abs(offset);
                      
                      if (absOffset > 1) return null;

                      return (
                        <motion.div
                          key={index}
                          className="absolute inset-0 w-full"
                          initial={{ 
                            rotateY: 0,
                            scale: 1 - absOffset * 0.1,
                            x: offset * 30,
                            y: absOffset * 20,
                            opacity: 1 - absOffset * 0.3,
                            zIndex: 10 - absOffset
                          }}
                          animate={{ 
                            rotateY: isFlipped && offset === 0 ? 180 : 0,
                            scale: 1 - absOffset * 0.1,
                            x: offset * 30,
                            y: absOffset * 20,
                            opacity: 1 - absOffset * 0.3,
                            zIndex: 10 - absOffset
                          }}
                          transition={{ duration: 0.6 }}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          <div 
                            className="relative w-full h-80 cursor-pointer"
                            onClick={() => offset === 0 && setIsFlipped(!isFlipped)}
                          >
                            {/* Front */}
                            <div 
                              className="absolute inset-0 backface-hidden bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border-2 border-blue-100 p-8 flex flex-col items-center justify-center"
                              style={{ backfaceVisibility: 'hidden' }}
                            >
                              <div className="text-6xl mb-6">{card.emoji}</div>
                              <h3 className="text-4xl font-bold text-gray-900 mb-2">{card.front}</h3>
                              <p className="text-gray-500 text-sm">Click để lật thẻ</p>
                            </div>

                            {/* Back */}
                            <div 
                              className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center"
                              style={{ 
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                              }}
                            >
                              <div className="text-6xl mb-6">{card.emoji}</div>
                              <h3 className="text-4xl font-bold text-white mb-2">{card.back}</h3>
                              <p className="text-blue-100 text-sm">Nghĩa tiếng Việt</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Floating Buttons */}
              <div className="hidden sm:block absolute inset-0 pointer-events-none">
                {['Again', 'Hard', 'Good', 'Easy'].map((btn, i) => (
                  <motion.div
                    key={btn}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${15 + i * 20}%`,
                      bottom: `${25 + (i % 2) * 15}%`,
                    }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  >
                    <div className="px-4 py-2 bg-white rounded-lg shadow-lg text-sm font-medium text-gray-700 border border-gray-200">
                      {btn}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div 
            className="space-y-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Tại sao chọn{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FlashLearn?
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Được xây dựng dựa trên nghiên cứu khoa học về trí nhớ và học tập
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mt-24 md:mt-32 py-16 md:py-20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10"></div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Sẵn sàng bắt đầu hành trình học tập?
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Tham gia cùng hàng nghìn người học đang cải thiện vốn từ vựng mỗi ngày
                </p>
                <motion.button
                  onClick={() => router.push('/register')}
                  className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tạo tài khoản miễn phí →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 mt-24 py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600">
            © 2025 FlashLearn. Made with ❤️ by <span className="font-semibold text-blue-600">Hải - Hào - Trường Danh</span>
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}