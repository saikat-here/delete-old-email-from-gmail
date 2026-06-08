/**
 * Gmail cleanup: unread Promotions + Updates + Social + Forums, older than 180 days.
 *
 * Guarantees / behavior:
 *  - Targets ONLY unread mail in the Promotions, Updates, and Social category tabs.
 *  - Acts only on mail older than MAX_AGE_DAYS (default 180).
 *  - Never touches a thread that contains a read message (ONLY_FULLY_UNREAD).
 *  - Moves matches to TRASH (recoverable for 30 days) — never permanent delete.
 *  - DRY_RUN logs exactly what it WOULD trash without changing anything.
 *
 * Recommended flow:
 *  1) DRY_RUN=true  -> run once, review the log counts.
 *  2) DRY_RUN=false -> run to actually trash the 180-day+ backlog.
 *  3) Add a daily/weekly time trigger so the 365-day sweep stays automatic.
 */

// ----------------------------- CONFIG -----------------------------
const DRY_RUN              = false;  // true = log only. Set false to actually trash.
const MAX_AGE_DAYS         = 700;   // only act on mail older than this many days. 0 = no limit.
const ONLY_FULLY_UNREAD    = true;  // skip any thread that has even one read message.
const MAX_THREADS_PER_RUN  = 50;  // safety cap to stay under the 6-min execution limit.
const TRASH_BATCH          = 10;   // GmailApp.moveThreadsToTrash max per call.
const LOG_TO_SHEET         = true; // true = append an audit row per thread to a Sheet.
const SHEET_ID             = '1z5x_4kPupVCZxMvkHLVpzuKi0siK0WqH1CYl78iB5FI';    // required only if LOG_TO_SHEET = true.
// ------------------------------------------------------------------

function cleanupUnreadPromoSpam() {
  const queries = buildQueries_();
  let matched = 0, acted = 0, skippedRead = 0;
  const audit = [];

  queries.forEach(function (q) {
    const threads = gatherAll_(q, MAX_THREADS_PER_RUN);
    const toTrash = [];

    threads.forEach(function (t) {
      matched++;
      if (ONLY_FULLY_UNREAD && hasReadMessage_(t)) {
        skippedRead++;
        return;
      }
      toTrash.push(t);
      audit.push([
        new Date(),
        q,
        t.getFirstMessageSubject(),
        t.getId(),
        DRY_RUN ? 'DRY_RUN' : 'TRASHED'
      ]);
    });

    if (!DRY_RUN) {
      for (var i = 0; i < toTrash.length; i += TRASH_BATCH) {
        GmailApp.moveThreadsToTrash(toTrash.slice(i, i + TRASH_BATCH));
        Utilities.sleep(200); // be gentle on quota
      }
    }
    acted += toTrash.length;
  });

  Logger.log(
    'Matched: %s | %s: %s | Skipped (thread had a read msg): %s',
    matched, (DRY_RUN ? 'Would trash' : 'Trashed'), acted, skippedRead
  );

  if (LOG_TO_SHEET) writeAudit_(audit);
}

/** Build the search queries for the three target category tabs. */
function buildQueries_() {
  var age = MAX_AGE_DAYS > 0 ? (' older_than:' + MAX_AGE_DAYS + 'd') : '';
  return [
    'is:unread category:promotions' + age,
    'is:unread category:updates'    + age,
    'is:unread category:social'     + age,
    'is:unread category:forums'     + age
  ];
}

/** Paginate a search fully (no mutation while gathering), up to `cap` threads. */
function gatherAll_(query, cap) {
  var out = [];
  var start = 0;
  while (out.length < cap) {
    var batch = GmailApp.search(query, start, 100);
    if (batch.length === 0) break;
    out = out.concat(batch);
    if (batch.length < 100) break;
    start += 100;
  }
  return out.slice(0, cap);
}

/** True if the thread contains at least one already-read message. */
function hasReadMessage_(thread) {
  return thread.getMessages().some(function (m) { return !m.isUnread(); });
}

/** Optional: append audit rows to a Google Sheet. */
function writeAudit_(rows) {
  if (!rows.length || !SHEET_ID) return;
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('cleanup_log') || ss.insertSheet('cleanup_log');
  if (sh.getLastRow() === 0) {
    sh.appendRow(['timestamp', 'query', 'subject', 'threadId', 'action']);
  }
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}
