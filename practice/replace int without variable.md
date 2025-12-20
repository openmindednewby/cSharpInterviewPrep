Excellent interview-style question 💡

You can swap **two integer values without using a third variable** using either **arithmetic operations** or **bitwise XOR**.

Let’s go through both 👇

---

## 🧮 1️⃣ Method 1 — Using Arithmetic (Addition & Subtraction)

```csharp
int a = 5;
int b = 10;

a = a + b; // a = 15
b = a - b; // b = 5
a = a - b; // a = 10

Console.WriteLine($"a = {a}, b = {b}");
```

✅ Output:

```
a = 10, b = 5
```

### ⚙️ How it works

* Step 1: `a` temporarily holds the sum of both.
* Step 2: Subtracting `b` from sum gives original `a`.
* Step 3: Subtracting new `b` gives original `b`.

### ⚠️ Caveat

* Risk of **integer overflow** if `a + b` exceeds the data type’s range.

---

## ⚡ 2️⃣ Method 2 — Using Bitwise XOR

```csharp
int a = 5;
int b = 10;

a = a ^ b;
b = a ^ b;
a = a ^ b;

Console.WriteLine($"a = {a}, b = {b}");
```

✅ Output:

```
a = 10, b = 5
```

### 🧠 How it works

XOR has a neat property:

* `x ^ x = 0`
* `x ^ 0 = x`
* `x ^ y ^ y = x`

So:

1. `a = a ^ b` → combined info of a & b
2. `b = a ^ b` → becomes original `a`
3. `a = a ^ b` → becomes original `b`

### ✅ Pros

* No overflow risk
* Works perfectly for integers

---

## 🔍 3️⃣ Comparison

| Method          | Uses     | Overflow Risk | Works For     | Readability    |
| --------------- | -------- | ------------- | ------------- | -------------- |
| **Arithmetic**  | `+`, `-` | ⚠️ Yes        | Numeric types | Moderate       |
| **Bitwise XOR** | `^`      | ✅ No          | Integers only | Less intuitive |

---

## 🚀 Interview Tip

If asked in an interview, say:

> “There are two main ways — arithmetic or bitwise XOR. XOR is safer because it avoids overflow and doesn’t need extra storage.”

---

Would you like me to explain *why* the XOR trick mathematically guarantees that the two values swap back correctly (bitwise reasoning)?
