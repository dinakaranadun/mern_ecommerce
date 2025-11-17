import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Instagram,
  Facebook,
} from 'lucide-react';
import Footer from '@/components/common/footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            We're here to help
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Let's start a<br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              conversation
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or want to work together? Drop us a message and 
            we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Contact Cards */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="space-y-6">
                <div className="flex items-start gap-4 group-hover:translate-x-1 transition-transform">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">easycom@company.com</p>
                    <p className="text-sm text-gray-500 mt-1">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                <div className="flex items-start gap-4 group-hover:translate-x-1 transition-transform">
                  <div className="p-3 bg-green-50 rounded-2xl">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+94 11 111 1111</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am-6pm</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                <div className="flex items-start gap-4 group-hover:translate-x-1 transition-transform">
                  <div className="p-3 bg-purple-50 rounded-2xl">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600">123 Main Street</p>
                    <p className="text-sm text-gray-500 mt-1">Colombo, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl text-white">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Follow Us
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                Join our community for updates and exclusive offers
              </p>
              <div className="flex items-center justify-start gap-5 ">
                <SocialLink  icon={<Instagram className="w-10 h-10 " />} />
                <SocialLink icon={<Facebook className="w-10 h-10 " />} />
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-7 border border-blue-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quick Response Guarantee</h4>
                  <p className="text-sm text-gray-600">
                    We pride ourselves on fast, helpful responses. Most inquiries answered within 2 hours during business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
              {isSubmitted ? (
                <div className="text-center py-16 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    Message Sent Successfully! 🎉
                  </h3>
                  <p className="text-gray-600 text-lg mb-8">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Expected response time: Within 24 hours
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Send us a message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        label="Your Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        focused={focusedField === 'name'}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <FormField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        focused={focusedField === 'email'}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>

                    <FormField
                      label="Subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      focused={focusedField === 'subject'}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                    />

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        required
                        rows={6}
                        className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all resize-none ${
                          focusedField === 'message'
                            ? 'border-gray-900 bg-white'
                            : 'border-transparent hover:bg-gray-100'
                        }`}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white font-semibold py-5 px-8 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending your message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FAQCard
              question="What are your response times?"
              answer="We typically respond to all inquiries within 24 hours during business days. Urgent matters are prioritized and often answered within 2-4 hours."
            />
            <FAQCard
              question="Do you offer phone support?"
              answer="Yes! Our phone support is available Monday through Friday, 9am to 6pm. For after-hours inquiries, please use the contact form."
            />
            <FAQCard
              question="Can I visit your physical store?"
              answer="Absolutely! We welcome visitors at our Colombo location. We are there to assisst you."
            />
            <FAQCard
              question="How do I track my order?"
              answer="You can track your order through your account dashboard after purchase."
            />
          </div>
        </div>
      </div>

      <style>{`
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
      <Footer/>
    </div>
  );
};

const FormField = ({ label, name, type, value, onChange, placeholder, focused, onFocus, onBlur }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      required
      className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${
        focused
          ? 'border-gray-900 bg-white'
          : 'border-transparent hover:bg-gray-100'
      }`}
      placeholder={placeholder}
    />
  </div>
);

const SocialLink = ({ icon }) => (
  <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95">
    {icon}
  </button>
);

const FAQCard = ({ question, answer }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow ">
    <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
    <p className="text-gray-600 text-sm">{answer}</p>
  </div>
);

export default ContactUs;