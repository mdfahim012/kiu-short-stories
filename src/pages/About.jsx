import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="neo-card p-7">
        <h1 className="text-xl font-semibold mb-4">About KIU Short Stories</h1>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          KIU Short Stories হলো Kishoreganj University-এর শিক্ষার্থীদের জন্য একটি এনোনিমাস
          কমিউনিটি প্ল্যাটফর্ম, যেখানে সবাই নিজের পরিচয় গোপন রেখে গল্প, অনুভূতি এবং মতামত শেয়ার
          করতে পারে। প্রত্যেক ইউজারকে একটি স্থায়ী Kiubian পরিচয় দেওয়া হয়, যা কখনো পরিবর্তন করা
          যায় না, যাতে প্রকৃত গোপনীয়তা বজায় থাকে।
        </p>
      </motion.div>
    </div>
  )
}
