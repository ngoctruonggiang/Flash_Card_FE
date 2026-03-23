# **Frontend Guide: Flashcard Events & State**

## **1\. User Interaction Flow**

The frontend is responsible for displaying the card, capturing the user's rating, and optimistically updating the UI or handling the API response.

The following flowchart illustrates the decision tree the user moves through. Use this to understand why a card might seemingly "reset" or jump dates.

```mermaid
graph TD
    Start([User Reviews Card]) --> CheckState{Card Status?}

    %% --- LEARNING PHASE ---
    CheckState -- New / Learning --> LearnDecide[User Rating?]

    LearnDecide -- Again --> L_Fail[Reset Step Index to 0]
    L_Fail --> L_SetNext[Next Due: <br/>1st Learning Step<br/>e.g., 1 min]

    LearnDecide -- Hard --> L_Hard[No Step Advance]
    L_Hard --> L_HardCalc[Next Due: <br/>Current Step * 1.5]

    LearnDecide -- Good --> L_Good{More Steps?}
    L_Good -- Yes --> L_IncStep[Step Index + 1]
    L_IncStep --> L_NextStep[Next Due: <br/>Value of New Step]

    L_Good -- No --> Graduate[GRADUATE]
    LearnDecide -- Easy --> Graduate

    Graduate --> SetReviewMode[Set Status: REVIEW]
    SetReviewMode --> InitReview[Interval: Graduating Interval<br/>Default: 1 Day<br/>EF: 2.5]

    %% --- REVIEW PHASE ---
    CheckState -- Review --> ReviewDecide[User Rating?]

    ReviewDecide -- Again --> R_Fail[LAPSE]
    R_Fail --> SetRelearn[Set Status: RELEARNING]
    SetRelearn --> DropEase[Ease Factor - 0.20<br/>min 1.3]
    DropEase --> ResetIvl[Interval: 1 Day<br/>Enters Relearning Steps]

    ReviewDecide -- Hard --> R_Hard[Hard Logic]
    R_Hard --> CalcHard[Interval * 1.2<br/>Ease Factor - 0.15]

    ReviewDecide -- Good --> R_Good[Good Logic]
    R_Good --> CalcGood[Interval * Ease Factor]

    ReviewDecide -- Easy --> R_Easy[Easy Logic]
    R_Easy --> CalcEasy[Interval * Ease Factor * 1.3<br/>Ease Factor + 0.15]

```

## **2\. Event Handling & Button Logic**

### **The 4 Buttons**

The UI must display 4 buttons. It is "Best Practice" to show the **estimated next interval** on the button itself (e.g., "Good (10m)" or "Easy (4d)").

**Button Mapping:**

1. **Again (Fail):** Used when the user does not know the answer.
2. **Hard:** Used when the user struggled significantly.
3. **Good:** The default button. Used when the answer was recalled with reasonable effort.
4. **Easy:** Used when the answer was instant; boosts the interval aggressively.

### **Displaying "Next Due" Projections**

To display the labels (e.g., "10m", "4d"), the frontend should request these projections from the backend **when the card is loaded**, OR calculate them locally if using a shared library.

**Example UI State:**

```json
{
  "currentCard": {
    "id": "123",
    "front": "Hello",
    "back": "Hola",
    "status": "learning"
  },
  "projectedIntervals": {
    "again": "1 min",
    "hard": "6 min",
    "good": "10 min",
    "easy": "4 days"
  }
}
```

### **Event Handler (Pseudocode)**

```javascript
async function handleRating(rating) {
  // 1. Optimistic Update (Optional)
  // Hide current card, show loading or next card immediately

  // 2. API Call
  try {
    const response = await api.post(`/cards/${currentCard.id}/review`, {
      rating,
    });

    // 3. Confirm Update
    // If backend returns the updated card, sync state.
  } catch (error) {
    // Revert UI if failure
    showError("Failed to save review");
  }
}
```

## **3\. Formatting Time Intervals**

When displaying due_date or interval to the user:

- **\< 1 minute:** "Now"
- **\< 60 minutes:** "Xm" (e.g., 10m)
- **\< 24 hours:** "Xh" (e.g., 4h)
- **\>= 1 day:** "Xd" (e.g., 3d)
- **\> 30 days:** "Xmo" (e.g., 1.2mo)
- **\> 365 days:** "Xy" (e.g., 1.5y)
