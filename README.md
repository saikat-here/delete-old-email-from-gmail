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
