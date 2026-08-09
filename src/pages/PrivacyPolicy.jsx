import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="neo-card p-7">
        <h1 className="text-xl font-semibold mb-4">Privacy Policy</h1>
        <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-3">
          <p>
            KIU Short Stories রেজিস্ট্রেশনের সময় শুধুমাত্র Email, Password এবং Gender সংগ্রহ করে।
            কোনো প্রকৃত নাম কখনো জিজ্ঞাসা করা হয় না।
          </p>
          <p>
            প্রতিটি একাউন্টকে একটি স্থায়ী Anonymous Identity (Kiubian-XXXXXXX) দেওয়া হয়, যা কখনো
            পরিবর্তনযোগ্য নয় এবং যা দিয়ে প্রকৃত পরিচয় শনাক্ত করা সম্ভব নয়।
          </p>
          <p>
            পোস্ট করা ছবি এবং লেখা প্ল্যাটফর্মে সংরক্ষিত থাকে যতক্ষণ না ইউজার নিজে সেটা ডিলিট করে।
          </p>
        </div>
      </motion.div>
    </div>
  )
}
