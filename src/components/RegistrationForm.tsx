import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, X } from "lucide-react";

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    teamName: "",
    member1: "",
    member2: "",
    member3: "",
    member4: "",
    college: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.teamName) newErrors.teamName = "Team name is required";
    if (!formData.member1) newErrors.member1 = "Team leader is required";
    if (!formData.college) newErrors.college = "College name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Mock submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setRegistrationId(`HACK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      teamName: "",
      member1: "",
      member2: "",
      member3: "",
      member4: "",
      college: "",
      email: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <section className="py-24 relative z-10" id="register">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Hackathon <span className="text-gradient">Registration</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Register your team for the AI in Finance Hackathon.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Team Name *</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  className={`w-full bg-[#0B0F19] border ${errors.teamName ? 'border-red-500' : 'border-brand-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors`}
                  placeholder="Enter team name"
                />
                {errors.teamName && <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Contact Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[#0B0F19] border ${errors.email ? 'border-red-500' : 'border-brand-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors`}
                  placeholder="team@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">College / University *</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className={`w-full bg-[#0B0F19] border ${errors.college ? 'border-red-500' : 'border-brand-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors`}
                placeholder="Enter college name"
              />
              {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-border/50">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Member 1 (Leader) *</label>
                <input
                  type="text"
                  name="member1"
                  value={formData.member1}
                  onChange={handleChange}
                  className={`w-full bg-[#0B0F19] border ${errors.member1 ? 'border-red-500' : 'border-brand-border'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors`}
                  placeholder="Full name"
                />
                {errors.member1 && <p className="text-red-500 text-xs mt-1">{errors.member1}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Member 2</label>
                <input
                  type="text"
                  name="member2"
                  value={formData.member2}
                  onChange={handleChange}
                  className="w-full bg-[#0B0F19] border border-brand-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                  placeholder="Full name (optional)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Member 3</label>
                <input
                  type="text"
                  name="member3"
                  value={formData.member3}
                  onChange={handleChange}
                  className="w-full bg-[#0B0F19] border border-brand-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                  placeholder="Full name (optional)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Member 4</label>
                <input
                  type="text"
                  name="member4"
                  value={formData.member4}
                  onChange={handleChange}
                  className="w-full bg-[#0B0F19] border border-brand-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                  placeholder="Full name (optional)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full neon-button py-4 text-lg font-medium mt-8 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Register Team"
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-8 max-w-md w-full relative text-center"
            >
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
              <p className="text-gray-400 mb-6">
                Your team has been successfully registered for the hackathon.
              </p>
              
              <div className="bg-[#0B0F19] border border-brand-border rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Registration ID</p>
                <p className="text-2xl font-mono font-bold text-accent-cyan tracking-wider">{registrationId}</p>
              </div>
              
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full px-6 py-3 rounded-xl bg-brand-surface border border-brand-border text-white font-medium hover:bg-brand-surface-hover transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
