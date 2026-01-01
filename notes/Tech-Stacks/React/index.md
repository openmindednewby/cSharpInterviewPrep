# React

React is a JavaScript library for building user interfaces, maintained by Meta (formerly Facebook). It's component-based and allows developers to create reusable UI components.

## Core Concepts

### Components
- **Functional Components**: Modern way to create components using functions
- **Class Components**: Traditional way using ES6 classes (legacy)
- **Props**: Read-only data passed from parent to child components
- **State**: Local component data that can change over time

### Hooks
- **useState**: Manage local state in functional components
- **useEffect**: Handle side effects (API calls, subscriptions, etc.)
- **useContext**: Access context values without prop drilling
- **useReducer**: Manage complex state logic
- **useMemo**: Memoize expensive calculations
- **useCallback**: Memoize callback functions
- **useRef**: Access DOM elements or persist values across renders

### Virtual DOM
- React maintains a virtual representation of the actual DOM
- Updates are batched and optimized for performance
- Only changed elements are updated in the real DOM

## Key Features

### JSX
JavaScript XML - syntax extension that looks like HTML but is JavaScript:

```jsx
const element = <h1>Hello, world!</h1>;
```

### Component Lifecycle
1. **Mounting**: Component is created and inserted into DOM
2. **Updating**: Component re-renders due to state/props changes
3. **Unmounting**: Component is removed from DOM

### State Management
- **Local State**: useState for simple component state
- **Context API**: Share state across component tree
- **Redux**: External state management library
- **Zustand/Recoil**: Modern lightweight alternatives

## Common Patterns

### Controlled Components
Form inputs controlled by React state:

```jsx
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Lifting State Up
Moving state to common ancestor when multiple components need it

### Composition vs Inheritance
React recommends composition over inheritance for code reuse

### Higher-Order Components (HOC)
Functions that take a component and return a new component

### Render Props
Technique for sharing code using props with function values

## Integration with C# Backend

### API Communication
```jsx
useEffect(() => {
  fetch('https://api.example.com/data')
    .then(res => res.json())
    .then(data => setData(data));
}, []);
```

### SignalR Integration
Real-time communication with ASP.NET Core:
```jsx
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('/chatHub')
  .build();
```

## Interview Topics

### Performance Optimization
- Memoization (React.memo, useMemo, useCallback)
- Code splitting and lazy loading
- Virtual scrolling for large lists
- Debouncing and throttling

### Common Questions
1. What is the Virtual DOM and how does it work?
2. Explain the difference between state and props
3. What are React hooks and why were they introduced?
4. How do you handle forms in React?
5. What is prop drilling and how can you avoid it?
6. Explain the component lifecycle
7. What is the difference between controlled and uncontrolled components?
8. How do you optimize React performance?

## Best Practices

1. **Keep Components Small**: Single responsibility principle
2. **Use Functional Components**: Modern standard with hooks
3. **Avoid Inline Functions**: In render methods (performance)
4. **Proper Key Props**: When rendering lists
5. **Error Boundaries**: Catch JavaScript errors in component tree
6. **Type Safety**: Use TypeScript or PropTypes
7. **Code Splitting**: Load code only when needed
8. **Accessibility**: Use semantic HTML and ARIA attributes

## Resources

- [Official React Documentation](https://react.dev/)
- [React Patterns](https://reactpatterns.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Related Topics

- [TypeScript](https://www.typescriptlang.org/docs/)
- [Testing Strategies](../../testing-strategies.md)
- [Design Patterns](../../Design-Patterns/)
