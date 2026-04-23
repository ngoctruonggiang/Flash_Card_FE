# Statistics API Endpoints Request

> **Purpose**: This document outlines the API endpoints needed for the `/statistics` page in the frontend. These endpoints should provide **user-level aggregated statistics** across all decks.

## Background

The current API endpoints are all deck-specific (`/deck/:id/*` or `/study/*/:deckId`). The statistics page requires **global user statistics** that aggregate data across all decks belonging to the authenticated user.

---

## Required Endpoints

### 1. Get User Statistics

Get comprehensive statistics for the current user across all their decks.

- **URL**: `/study/user-statistics`
- **Method**: GET
- **Auth Required**: Yes
- **Query Parameters**:
  - `timeRange` (optional): One of `week`, `month`, `year`. Defaults to `week`.

**Expected Response (200 OK):**

```json
{
  "statusCode": 200,
  "timestamp": "2025-12-23T10:00:00.000Z",
  "message": "Get User Statistics",
  "data": {
    "totalCards": 856,
    "studiedToday": 23,
    "studiedThisWeek": 156,
    "studiedThisMonth": 623,
    "currentStreak": 7,
    "longestStreak": 15,
    "averageAccuracy": 87.5,
    "totalStudyTime": 205200,
    "cardsPerDay": 22.3,
    "bestDay": "Monday",
    "totalDecks": 12,
    "totalReviews": 2450
  },
  "path": "/api/study/user-statistics"
}
```

**Response Field Descriptions:**

| Field              | Type   | Description                                                    |
| ------------------ | ------ | -------------------------------------------------------------- |
| `totalCards`       | number | Total number of cards across all user's decks                  |
| `studiedToday`     | number | Number of unique cards reviewed today                          |
| `studiedThisWeek`  | number | Number of unique cards reviewed in the last 7 days             |
| `studiedThisMonth` | number | Number of unique cards reviewed in the last 30 days            |
| `currentStreak`    | number | Current consecutive study days (across all decks)              |
| `longestStreak`    | number | Longest streak ever achieved                                   |
| `averageAccuracy`  | number | Weighted average accuracy across all reviews (%)               |
| `totalStudyTime`   | number | Total study time in seconds (estimated: 10 seconds per review) |
| `cardsPerDay`      | number | Average cards studied per day (last 30 days)                   |
| `bestDay`          | string | Day of the week with highest average reviews (e.g., "Monday")  |
| `totalDecks`       | number | Total number of decks owned by user                            |
| `totalReviews`     | number | Total number of reviews submitted                              |

---

### 2. Get User Daily Breakdown

Get daily statistics for the user within a time range, aggregated across all decks.

- **URL**: `/study/user-daily-breakdown`
- **Method**: GET
- **Auth Required**: Yes
- **Query Parameters**:
  - `startDate` (required): Start date in ISO 8601 format (e.g., `2025-12-16`)
  - `endDate` (required): End date in ISO 8601 format (e.g., `2025-12-23`)

**Expected Response (200 OK):**

```json
{
  "statusCode": 200,
  "timestamp": "2025-12-23T10:00:00.000Z",
  "message": "Get User Daily Breakdown",
  "data": {
    "startDate": "2025-12-16",
    "endDate": "2025-12-23",
    "dailyBreakdown": [
      {
        "date": "2025-12-16",
        "dayOfWeek": "Monday",
        "cardsReviewed": 35,
        "accuracy": 89.5,
        "studyTime": 350,
        "decksStudied": 2
      },
      {
        "date": "2025-12-17",
        "dayOfWeek": "Tuesday",
        "cardsReviewed": 28,
        "accuracy": 91.2,
        "studyTime": 280,
        "decksStudied": 1
      },
      {
        "date": "2025-12-18",
        "dayOfWeek": "Wednesday",
        "cardsReviewed": 42,
        "accuracy": 83.0,
        "studyTime": 420,
        "decksStudied": 3
      },
      {
        "date": "2025-12-19",
        "dayOfWeek": "Thursday",
        "cardsReviewed": 23,
        "accuracy": 87.0,
        "studyTime": 230,
        "decksStudied": 1
      },
      {
        "date": "2025-12-20",
        "dayOfWeek": "Friday",
        "cardsReviewed": 18,
        "accuracy": 92.0,
        "studyTime": 180,
        "decksStudied": 2
      },
      {
        "date": "2025-12-21",
        "dayOfWeek": "Saturday",
        "cardsReviewed": 10,
        "accuracy": 88.0,
        "studyTime": 100,
        "decksStudied": 1
      },
      {
        "date": "2025-12-22",
        "dayOfWeek": "Sunday",
        "cardsReviewed": 0,
        "accuracy": 0,
        "studyTime": 0,
        "decksStudied": 0
      }
    ],
    "summary": {
      "totalCardsReviewed": 156,
      "averageAccuracy": 88.4,
      "totalStudyTime": 1560,
      "daysStudied": 6,
      "totalDaysInRange": 7
    }
  },
  "path": "/api/study/user-daily-breakdown?startDate=2025-12-16&endDate=2025-12-23"
}
```

**Response Field Descriptions:**

| Field                            | Type   | Description                             |
| -------------------------------- | ------ | --------------------------------------- |
| `dailyBreakdown`                 | array  | Array of daily statistics objects       |
| `dailyBreakdown[].date`          | string | Date in YYYY-MM-DD format               |
| `dailyBreakdown[].dayOfWeek`     | string | Day of the week (e.g., "Monday")        |
| `dailyBreakdown[].cardsReviewed` | number | Unique cards reviewed on this day       |
| `dailyBreakdown[].accuracy`      | number | Accuracy percentage for that day        |
| `dailyBreakdown[].studyTime`     | number | Study time in seconds                   |
| `dailyBreakdown[].decksStudied`  | number | Number of different decks studied       |
| `summary`                        | object | Aggregated summary for the entire range |

**Notes:**

- Days with no reviews should still be included with zeroed values
- This powers the weekly/monthly chart in the statistics page

---

### 3. Get Recent Activity

Get the user's most recent study activities across all decks.

- **URL**: `/study/recent-activity`
- **Method**: GET
- **Auth Required**: Yes
- **Query Parameters**:
  - `limit` (optional): Number of activities to return. Default: 10, Max: 50

**Expected Response (200 OK):**

```json
{
  "statusCode": 200,
  "timestamp": "2025-12-23T10:00:00.000Z",
  "message": "Get Recent Activity",
  "data": [
    {
      "id": 1,
      "type": "study",
      "date": "2025-12-23T09:30:00.000Z",
      "deckId": 5,
      "deckName": "Từ vựng IELTS",
      "cardsReviewed": 23,
      "accuracy": 89.0,
      "studyTime": 900,
      "newCards": 5,
      "reviewCards": 18
    },
    {
      "id": 2,
      "type": "study",
      "date": "2025-12-22T14:20:00.000Z",
      "deckId": 3,
      "deckName": "Business English",
      "cardsReviewed": 35,
      "accuracy": 85.0,
      "studyTime": 1320,
      "newCards": 8,
      "reviewCards": 27
    },
    {
      "id": 3,
      "type": "deck_created",
      "date": "2025-12-22T10:15:00.000Z",
      "deckId": 12,
      "deckName": "Phrasal Verbs",
      "cardsReviewed": 0,
      "accuracy": 0,
      "studyTime": 0,
      "newCards": 0,
      "reviewCards": 0
    }
  ],
  "path": "/api/study/recent-activity?limit=10"
}
```

**Response Field Descriptions:**

| Field           | Type   | Description                                           |
| --------------- | ------ | ----------------------------------------------------- |
| `id`            | number | Unique activity identifier                            |
| `type`          | string | Activity type: `study`, `deck_created`, `cards_added` |
| `date`          | string | ISO 8601 timestamp of the activity                    |
| `deckId`        | number | ID of the related deck                                |
| `deckName`      | string | Name of the related deck                              |
| `cardsReviewed` | number | Cards reviewed (for study sessions)                   |
| `accuracy`      | number | Accuracy percentage (for study sessions)              |
| `studyTime`     | number | Time spent in seconds (for study sessions)            |
| `newCards`      | number | New cards introduced (for study sessions)             |
| `reviewCards`   | number | Review cards studied (for study sessions)             |

**Notes:**

- Activities should be sorted by date descending (most recent first)
- Include both study sessions and significant events (deck creation, bulk card imports)
- Study sessions can be identified by grouping reviews by date + deck

---

## Implementation Notes

### Streak Calculation (User-Level)

The `currentStreak` should be calculated across all decks:

- A study day is counted if the user reviewed at least one card in ANY deck
- Streak breaks if no cards were reviewed on a calendar day

### Time Estimation

Since `timeSpent` is not tracked per review:

- Estimate: `totalStudyTime = totalReviews * 10` (seconds)
- Or track actual time in future implementation

### Accuracy Calculation

```
averageAccuracy = (totalCorrectReviews / totalReviews) * 100
```

Where correct = reviews with quality ≥ 3 (Hard, Good, Easy)

---

## Frontend Usage

These endpoints will power the following UI components:

1. **StatsOverview** - Total cards, studied today/week, streak, accuracy
2. **WeeklyChart** - Daily breakdown visualization
3. **RecentActivityList** - Recent study sessions
4. **AdditionalStats** - Total study time, best day, cards per day

---

## Priority

| Endpoint                      | Priority   | Reason                |
| ----------------------------- | ---------- | --------------------- |
| `/study/user-statistics`      | **High**   | Core stats display    |
| `/study/user-daily-breakdown` | **High**   | Weekly/monthly charts |
| `/study/recent-activity`      | **Medium** | Activity feed         |
