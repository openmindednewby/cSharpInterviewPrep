# Using `base` in C# — immediate base class explained

In object-oriented programming (especially in **C#**), the keyword **`base`** is used inside a derived class to refer to its **immediate parent (base) class**.

Here’s what that means, clearly and simply:

---

### ✅ **What “immediate base class” refers to**

If you have a class that *inherits* from another class, the class it inherits from is called its **base class**.
Inside the derived class, the keyword **`base`** lets you access:

* The base class’s **methods**
* The base class’s **properties**
* The base class’s **constructors**
* The base class’s **indexers**

…even if they are hidden or overridden in the derived class.

---

### 📌 Example

```csharp
class Animal
{
    public void MakeSound()
    {
        Console.WriteLine("Animal sound");
    }
}

class Dog : Animal
{
    public void MakeSound()
    {
        Console.WriteLine("Dog sound");
    }

    public void CallBaseSound()
    {
        base.MakeSound(); // calls Animal.MakeSound()
    }
}
```

Here:

* `Animal` is the **base class**.
* `Dog` is the **derived class**.
* Inside `Dog`, the keyword `base` refers specifically to **Animal**, which is the *immediate* parent.

---

### 📌 Why "immediate" base class?

If there is a long inheritance chain, like:

```
Animal → Mammal → Dog
```

Inside `Dog`, `base` always means **Mammal**, not Animal.
So `base` refers only to the **direct** parent class.

---

### ✔ Summary

* **`base` = direct parent class of the current class**
* Used to access overridden or hidden members of the parent class
* Also used to call parent class constructors

---

If you want, I can also explain how `base` differs from `this`, or how it’s used in constructors.
