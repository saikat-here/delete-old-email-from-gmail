# 📧 Gmail Cleanup Script (Google Apps Script)

Automate cleanup of old, unread emails from Gmail categories like Promotions, Updates, Social, and Forums.

This script keeps your inbox clean by safely moving old unread emails to Trash while preserving anything important.

---

## 🚀 Features

- ✅ Targets only **unread emails**
- ✅ Works on Gmail categories:
  - Promotions
  - Updates
  - Social
  - Forums
- ✅ Filters emails older than a configurable number of days
- ✅ Skips threads containing **any read message**
- ✅ Safe deletion → moves emails to **Trash (recoverable for 30 days)**
- ✅ **Dry run mode** for testing before actual cleanup
- ✅ Logs activity to a Google Sheet (audit trail)
- ✅ Supports automatic scheduling via triggers

---

## ⚙️ Configuration

Update these variables at the top of the script:

```javascript
const DRY_RUN              = false;  // true = log only, no deletion
const MAX_AGE_DAYS         = 700;    // emails older than X days
const ONLY_FULLY_UNREAD    = true;   // skip threads with read messages
const MAX_THREADS_PER_RUN  = 50;     // limit per execution (avoid timeout)
const TRASH_BATCH          = 10;     // batch size for deletion
const LOG_TO_SHEET         = true;   // enable logging
const SHEET_ID             = 'YOUR_SHEET_ID';
```

# 📧 Gmail Cleanup Script — Step-by-Step Setup Guide (Beginner Friendly)

This guide walks you through **everything from scratch**, even if you’ve never used Google Apps Script before.

---

# 🧩 PART 1 — Create the Script

## Step 1: Open Google Apps Script

1. Open your browser
2. Go to: https://script.google.com
3. Click **"New Project"**

---

## Step 2: Add Your Script

1. You will see a blank editor
2. Delete any existing code
3. Paste your full script
4. Click **💾 Save**
5. Give your project a name.



# ⏰ How to Schedule Gmail Cleanup Script (Step-by-Step)

Follow these simple steps to automatically run your Gmail cleanup script at a fixed time.

---

## ✅ Step 1: Open Your Script

1. Go to: https://script.google.com  
2. Open your saved project (e.g., **Gmail Cleanup Automation**)

---

## ✅ Step 2: Open Triggers Page

1. Look at the **left sidebar**
2. Click the **⏰ Triggers icon**

---

## ✅ Step 3: Add a New Trigger

1. Click the button:

``

