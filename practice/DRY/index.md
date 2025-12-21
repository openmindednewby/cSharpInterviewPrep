# DRY (Don't Repeat Yourself) - Practice Exercises

Exercises focused on reducing duplication without over-abstracting.

---

### Exercise 1: Identify Duplication
**Q:** Find duplicated logic in two pricing methods and propose a shared helper.

A: Extract the shared calculation into a single private method or domain service.

---

### Exercise 2: Extract Method
**Q:** Refactor repeated validation checks into a single method.

A: Create `ValidateOrder` and reuse it across handlers.

---

### Exercise 3: Use Configuration
**Q:** Replace repeated magic numbers with configuration.

A: Use `IOptions<T>` and pull limits from configuration.

---

### Exercise 4: Generic Helper
**Q:** Create a generic method to add pagination to queries.

A: Use a reusable `ApplyPaging` extension on `IQueryable<T>`.

---

### Exercise 5: Extension Methods
**Q:** Move repeated DTO mapping into extension methods.

A: `Order.ToDto()` encapsulates mapping in one place.

---

### Exercise 6: Avoid Premature Abstraction
**Q:** When should you NOT extract shared code?

A: If two code paths are similar but likely to diverge, keep them separate.

---

### Exercise 7: Template Method Pattern
**Q:** Apply a template method to share a workflow.

A: Extract common steps and allow overrides for specific steps.

---

### Exercise 8: Strategy Pattern for Variants
**Q:** Replace duplicated if/else pricing logic with strategies.

A: Create `IPricingStrategy` implementations and select at runtime.

---

### Exercise 9: Shared Validation Rules
**Q:** Reuse FluentValidation rules between DTOs.

A: Create a base validator or use `Include` to share rules.

---

### Exercise 10: Consistent Error Mapping
**Q:** Centralize exception-to-error mapping.

A: Use middleware or a shared error mapper instead of repeated try/catch.

---

### Exercise 11: Use Common Result Types
**Q:** Standardize API responses.

A: Use a `Result<T>` or `ProblemDetails` to avoid duplicated response shapes.

---

### Exercise 12: Repository Base Class
**Q:** Share common repository CRUD operations.

A: Use a generic repository base, but keep domain-specific queries separate.

---

### Exercise 13: Shared Test Data Builders
**Q:** Remove repeated setup in tests.

A: Use builders or fixtures for reusable test data.

---

### Exercise 14: Mapping Profiles
**Q:** Centralize mapping rules.

A: AutoMapper profiles avoid duplicate mapping code in handlers.

---

### Exercise 15: Logging Helper
**Q:** Standardize log messages for business events.

A: Create helper methods for consistent log templates.

---

### Exercise 16: Avoid Copy-Paste Configuration
**Q:** Extract DI registration into extension methods.

A: Use `AddApplicationServices` and `AddInfrastructureServices`.

---

### Exercise 17: Shared Authorization Policies
**Q:** Avoid repeated policy checks across controllers.

A: Define policies once and use `[Authorize(Policy = "...")]`.

---

### Exercise 18: Shared Retry Policies
**Q:** Reuse Polly policies across clients.

A: Register named policies and apply to multiple HttpClients.

---

### Exercise 19: Shared DTO Validation
**Q:** Reuse validation rules across similar DTOs.

A: Use abstract validators and inherit from them.

---

### Exercise 20: Audit Trail Helpers
**Q:** Avoid repeated audit field assignments.

A: Use a single method to set `CreatedBy`, `UpdatedBy`, `UpdatedAt`.
