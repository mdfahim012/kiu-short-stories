# KIU Short Stories — আপডেট: হাইলাইট ফিক্স, কার্ড রিডিজাইন, নোটিফিকেশন, প্রোফাইল ফটো

## এবার যা ঠিক হয়েছে
- Highlight Tool: মোবাইলে সিলেকশন এখন রিলায়েবলভাবে কাজ করে
- Short Story Card: বাড়তি facebook/logo/author ওভারলে বাদ, শুধু তোমার দেওয়া ব্যাকগ্রাউন্ড ফুল সাইজে + টেক্সট (হাইলাইট সহ) পুরোপুরি মাঝ বরাবর
- Notifications: এখন Facebook-স্টাইল প্যানেল — অ্যাভাটার, unread নীল হাইলাইট, ঠিক জায়গায় দেখায়
- Profile Photo: ইউজার এখন নিজের ছবি আপলোড করতে পারবে (ImgBB API দিয়ে সার্ভারে সেভ থাকে), না দিলে আগের অটো-অ্যাভাটার থাকবে
- লোডিং স্টেট এখন স্কেলিটন অ্যানিমেশন দিয়ে, আগের চেয়ে স্মুথ

## Firestore Rules
এই আপডেটে **কোনো নতুন rules লাগবে না** — আগের rules ই কাজ করবে (profile ছবি ফিল্ড ইতিমধ্যের rules এই allowed)।

---



## ধাপ ৩ এ নতুন যা যোগ হয়েছে (সিগনেচার ফিচার)
- Short Story Photo Card: দুইটা ফিক্সড ব্যাকগ্রাউন্ডের যেকোনো একটা বেছে নেওয়া যায়
- সর্বোচ্চ ১০০ শব্দ, লাইভ প্রিভিউ (টাইপ করার সাথে সাথে কার্ড আপডেট হয়)
- Dynamic Typography: কম লেখা হলে বড় বোল্ড ফন্ট, বেশি লেখা হলে অটোমেটিক ছোট হয়ে যায়
- বাংলা টেক্সট LE Ador Noirrit Bold ফন্টে
- Highlight Tool: টেক্সট বক্সে শব্দ/লাইন সিলেক্ট করে "Highlight" চাপলে লাল হাইলাইট বসে, একাধিক হাইলাইট করা যায়, ম্যানুয়াল
- প্রতিটা স্টোরি কার্ডে স্থায়ী, অটো-বাড়ন্ত Story Number (গল্প নং ০০১, ০০২...)
- পোস্ট করার সময় পুরো কার্ডটা ছবি বানিয়ে (html-to-image দিয়ে) ImgBB তে আপলোড হয়

## ⚠️ Firestore Rules আবার আপডেট করা লাগবে
`storyCounter` এর জন্য নতুন rules যোগ হয়েছে। আগের মতোই Firebase Console → Firestore → Rules এ গিয়ে আপডেট করে Publish করো।

## নতুন dependency
`html-to-image` প্যাকেজ যোগ হয়েছে — GitHub এ push করলে Actions নিজে থেকেই এটা ইনস্টল করে নেবে, তোমাকে আলাদা কিছু করা লাগবে না।

---

# KIU Short Stories — ধাপ ১ + ধাপ ২ (Foundation + Feed System)

## ধাপ ২ এ নতুন যা যোগ হয়েছে
- News Feed (Facebook-style, ImgBB দিয়ে ছবি হোস্ট করা)
- Create Post: Photo + Caption (Short Story Card পরের ধাপে আসবে)
- Like / Love / Haha রিয়েকশন (একবার চাপলে যোগ হয়, আবার চাপলে সরে যায়, অন্যটা চাপলে বদলে যায়)
- কমেন্ট করা এবং দেখা
- Share (মোবাইলে native share sheet, ডেস্কটপে লিংক কপি) + শেয়ার কাউন্ট
- ছবি ডাউনলোড বাটন
- Feed Ranking Algorithm: রিসেন্সি + এনগেজমেন্ট (reaction/comment/share) মিলিয়ে স্কোর — নতুন পোস্ট শুরুতে ভিজিবিলিটি পায়, বেশি এনগেজড পোস্ট উপরে ওঠে
- Pagination ("আরও দেখো" বাটনে লোড হয়)
- Profile Page এ নিজের সব পোস্ট + Edit/Delete (তিন-ডট মেনু, শুধু নিজের পোস্টে)

## ⚠️ Firestore Rules আবার আপডেট করা লাগবে
posts/reactions/comments এর জন্য নতুন rules যোগ হয়েছে। Firebase Console → Firestore Database → Rules ট্যাবে গিয়ে এই প্রজেক্টের `firestore.rules` ফাইলের পুরো কন্টেন্ট কপি করে আগেরটা রিপ্লেস করে Publish করো (আগে যেভাবে করেছিলে ঠিক সেভাবে)।

---

# KIU Short Stories — ধাপ ১ (Foundation)

এই ধাপে যা যা তৈরি হয়েছে:
- React + Vite + Tailwind + Framer Motion সেটআপ
- Firebase Auth (Email/Password) দিয়ে Register ও Login
- Registration এ শুধু Email, Password, Gender (নাম নেই)
- স্থায়ী Anonymous Identity: `Kiubian-2026001`, `Kiubian-2026002`... (globally unique, Firestore transaction দিয়ে auto-increment)
- Gender অনুযায়ী auto SVG avatar (male/female আলাদা রঙ, চুল, পোশাক), ইউজার পরিবর্তন করতে পারবে না
- Neomorphism + Glass UI, Dark/Light Mode (লোকাল স্টোরেজে সেভ থাকে)
- লোগো থেকে অটোমেটিক কালার প্যালেট
- Top App Bar (Logo, Home, Notification, Profile, Hamburger)
- Hamburger Menu (Home, Profile, Login/Register বা Logout, Dark/Light, About, Contact, Privacy Policy)

**Hosting: GitHub Pages** (base path: `/kiu-short-stories/`)
**Backend: Firebase** (শুধু Authentication + Firestore — এটা অপরিহার্য, ডাটাবেস ছাড়া লগইন/পোস্ট কাজ করবে না)

Live URL হবে: `https://mdfahim012.github.io/kiu-short-stories/`

---

## ধাপ বাই ধাপ — তোমাকে যা করতে হবে

### ১. প্রজেক্ট ফাইল আনজিপ করো
ডাউনলোড করা `kiu-short-stories.zip` আনজিপ করো।

### ২. Node.js আছে কিনা চেক করো
```
node -v
npm -v
```
না থাকলে nodejs.org থেকে LTS ভার্সন ইনস্টল করো।

### ৩. Firebase Console এ দুটো কাজ করো (একবারই করতে হবে)
- Authentication → Sign-in method → Email/Password → Enable করো
- Authentication → Settings → Authorized domains → Add domain করো: `mdfahim012.github.io`
  (এটা না করলে GitHub Pages এ লাইভ হওয়ার পর Login/Register কাজ করবে না)
- Firestore Database তৈরি করো (production mode)

### ৪. GitHub এ Repository তৈরি করো
GitHub এ লগইন করে নতুন public repository বানাও, নাম দাও ঠিক এভাবে:
```
kiu-short-stories
```
(নামটা এক্সাক্ট এই বানানে হতে হবে, কারণ লিংক আর base path এটার সাথে মিলিয়ে সেট করা আছে)

### ৫. লোকাল ফোল্ডার থেকে GitHub এ পুশ করো
প্রজেক্ট ফোল্ডারে গিয়ে টার্মিনালে:
```
cd kiu-short-stories
git init
git add .
git commit -m "Step 1: Auth, Anonymous Identity, Neomorphism UI"
git branch -M main
git remote add origin https://github.com/mdfahim012/kiu-short-stories.git
git push -u origin main
```

### ৬. GitHub Pages Source সেট করো (একবারই করতে হবে)
GitHub repo তে যাও → Settings → Pages → Build and deployment → Source এ "GitHub Actions" সিলেক্ট করো।

এটা করার সাথে সাথে repo তে থাকা `.github/workflows/deploy.yml` ফাইলটা অটোমেটিক রান হয়ে যাবে — এটা নিজে থেকেই npm install, npm run build করে সাইট ডিপ্লয় করে দেবে।

### ৭. ডিপ্লয়মেন্ট চেক করো
GitHub repo → Actions ট্যাবে যাও → "Deploy to GitHub Pages" workflow রান হচ্ছে দেখতে পাবে (২-৩ মিনিট লাগে)। সবুজ চেকমার্ক হয়ে গেলে সাইট লাইভ:

```
https://mdfahim012.github.io/kiu-short-stories/
```

### ৮. পরের যেকোনো আপডেটে
এরপর থেকে যখনই নতুন কোড main ব্র্যাঞ্চে পুশ হবে, সাইট অটোমেটিক রিবিল্ড ও রিডিপ্লয় হয়ে যাবে।

---

## Firestore Rules আপলোড করা (প্রথমবার)
```
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```
এটা firestore.rules ফাইলের সিকিউরিটি রুলস Firebase এ পাঠায় (ইউজার নিজের প্রোফাইল ছাড়া কারো Kiubian ID/Gender বদলাতে পারবে না)।

---

## এরপর কী?
এই ধাপ লাইভ হয়ে কাজ করছে কনফার্ম করলে ধাপ ২ (Feed System) শুরু করব:
News Feed, Create Post (Photo+Caption), Like/Love/Haha, Comment, Share, Feed Ranking Algorithm।

তখন ImgBB API Key লাগবে — জোগাড় করে রেখো।
