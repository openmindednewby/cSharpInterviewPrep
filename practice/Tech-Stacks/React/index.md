# React - Practice Questions

Practice questions and exercises for React development, with focus on integration with C# backends.

## Theory Questions

### Fundamentals

1. **What is React and what problems does it solve?**
   - Component-based architecture
   - Virtual DOM for performance
   - Declarative UI
   - Reusable components

2. **Explain the difference between state and props**
   - Props: immutable data from parent
   - State: mutable data within component
   - Props flow down, events flow up

3. **What is JSX and why do we use it?**
   - JavaScript XML syntax
   - More readable than createElement
   - Type-safe with TypeScript
   - Compiled to JavaScript

4. **What are React Hooks and their purpose?**
   - Allow state in functional components
   - Replace class component lifecycle
   - Share logic between components
   - More composable than HOCs

5. **Explain the Virtual DOM**
   - In-memory representation of real DOM
   - Efficient diffing algorithm
   - Batch updates for performance
   - Only updates changed elements

### Advanced Concepts

6. **What is prop drilling and how do you solve it?**
   - Passing props through many levels
   - Solutions: Context API, state management libraries
   - Component composition patterns

7. **Explain useEffect and its cleanup function**
   - Side effects in functional components
   - Dependency array controls when it runs
   - Cleanup prevents memory leaks
   - Runs after render, not during

8. **What is React.memo and when should you use it?**
   - Memoization for functional components
   - Prevents unnecessary re-renders
   - Use for expensive components
   - Shallow comparison of props

9. **Difference between useMemo and useCallback?**
   - useMemo: memoize values
   - useCallback: memoize functions
   - Both optimize performance
   - Prevent unnecessary recalculations

10. **What are Error Boundaries?**
    - Catch JavaScript errors in component tree
    - Display fallback UI
    - Only work in class components (for now)
    - Don't catch errors in event handlers

## Coding Exercises

### Exercise 1: Todo List with API Integration

Create a Todo list that integrates with a C# Web API.

**Requirements:**
- Fetch todos from API on mount
- Add new todos via POST request
- Mark todos complete via PUT request
- Delete todos via DELETE request
- Show loading and error states
- Use TypeScript

**API Endpoints:**
```
GET    /api/todos
POST   /api/todos
PUT    /api/todos/{id}
DELETE /api/todos/{id}
```

**Hints:**
- Use useState for local state
- Use useEffect for fetching data
- Create custom hook useTodos
- Handle loading and error states
- Implement optimistic updates

<details>
<summary>Solution Outline</summary>

```tsx
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false })
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, completed: !todo.completed })
      });
      setTodos(todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo };
}
```

</details>

### Exercise 2: Real-Time Dashboard with SignalR

Build a real-time dashboard that receives updates from a C# SignalR hub.

**Requirements:**
- Connect to SignalR hub on mount
- Display real-time metrics
- Handle connection errors
- Clean up on unmount
- Show connection status

**Hints:**
- Use @microsoft/signalr package
- Create connection in useEffect
- Remember cleanup function
- Handle reconnection logic

<details>
<summary>Solution Outline</summary>

```tsx
import * as signalR from '@microsoft/signalr';

function useDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/dashboardHub')
      .withAutomaticReconnect()
      .build();

    connection.on('UpdateMetrics', (data: Metrics) => {
      setMetrics(data);
    });

    connection.onreconnecting(() => setConnected(false));
    connection.onreconnected(() => setConnected(true));

    connection.start()
      .then(() => setConnected(true))
      .catch(err => console.error('Connection failed:', err));

    return () => {
      connection.stop();
    };
  }, []);

  return { metrics, connected };
}
```

</details>

### Exercise 3: Form with Validation

Create a user registration form with validation.

**Requirements:**
- Email, password, confirm password fields
- Client-side validation
- Submit to C# API
- Display validation errors
- Disable submit while submitting

**Validation Rules:**
- Email must be valid format
- Password minimum 8 characters
- Password must match confirm password
- Required fields

<details>
<summary>Solution Outline</summary>

```tsx
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      // Handle success
    } catch (err) {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Register'}
      </button>
    </form>
  );
}
```

</details>

## Interview Scenarios

### Scenario 1: Performance Optimization

**Question:** Your React app is slow when rendering a large list. How do you optimize it?

**Answer:**
1. Use React.memo to prevent unnecessary re-renders
2. Implement virtual scrolling (react-window/react-virtualized)
3. Paginate or lazy load data
4. Use useMemo for expensive calculations
5. Debounce search/filter operations
6. Code splitting for large components

### Scenario 2: State Management

**Question:** When should you use Context API vs Redux vs local state?

**Answer:**
- **Local State**: Component-specific data, simple scenarios
- **Context API**: Shared data across component tree, theme, auth
- **Redux**: Complex state logic, time-travel debugging, large apps
- **Zustand/Recoil**: Modern alternative, less boilerplate

### Scenario 3: API Integration

**Question:** How do you handle authentication with a C# backend?

**Answer:**
1. Store JWT token from login response
2. Include token in Authorization header
3. Use axios interceptor for automatic inclusion
4. Refresh token before expiry
5. Redirect to login on 401 responses
6. Clear token on logout

## Best Practices Questions

1. **How do you structure a React project?**
   - Feature-based folders
   - Shared components directory
   - Custom hooks directory
   - API/services layer
   - Utils and helpers

2. **How do you test React components?**
   - React Testing Library
   - Jest for unit tests
   - Mock API calls
   - Test user interactions
   - Snapshot testing for UI

3. **How do you handle errors in React?**
   - Error boundaries for component errors
   - Try-catch for async operations
   - Global error handler
   - User-friendly error messages
   - Logging to monitoring service

## Resources

For notes and theory, see [React Notes](../../../notes/Tech-Stacks/React/index.md).
