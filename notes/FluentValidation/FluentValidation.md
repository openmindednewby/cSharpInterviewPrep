# FluentValidation — Senior developer guide

This note covers how to use FluentValidation properly and what a senior C#/.NET developer needs to know: core concepts, best practices, integration with ASP.NET Core, testing, performance, and advanced extension points.

---

## Quick overview

FluentValidation is a popular .NET library for building strongly-typed validation rules using a fluent API. It separates validation rules from models and supports composition, async checks, localization, and easy testing.

NuGet package: `FluentValidation` and for ASP.NET Core integration `FluentValidation.AspNetCore`.

---

## Core concepts and API

- Create a validator by implementing `AbstractValidator<T>`.
- Add rules with `RuleFor(x => x.Property).NotEmpty().Length(5, 50).Must(...);`
- Supports `When`, `Unless`, `CascadeMode` and `RuleSet` for conditional and grouped validation.
- Validators support async via `MustAsync`, custom `IValidator<T>` implementations, and `SetValidator` to compose nested validators.

Example:

```csharp
public class CreateOrderDto
{
    public string Symbol { get; set; }
    public decimal Amount { get; set; }
    public string CustomerId { get; set; }
}

public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    private readonly ILeaveTypeRepository _leaveTypeRepository;

    public CreateOrderDtoValidator(ILeaveTypeRepository leaveTypeRepository)
    {
        CascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Symbol)
            .NotEmpty()
            .Length(3, 10);

        RuleFor(x => x.Amount)
            .GreaterThan(0);

        RuleFor(x => x.CustomerId)
            .NotEmpty()
            .MustAsync(async (id, ct) => await CustomerExists(id))
            .WithMessage("Customer does not exist");

        // Example of nested validator
        RuleFor(x => x.Address).SetValidator(new AddressValidator());
        RuleFor(q => q)
        .MustAsync(LeaveTypeNameUnique).WithMessage("Leave type already exists");

        _leaveTypeRepository = leaveTypeRepository;
    }

    private async Task<bool> LeaveTypeNameUnique(CreateLeaveTypeCommand command, CancellationToken token)
    {
        return await _leaveTypeRepository.IsLeaveTypeUniqe(command.Name); 
    }
}
```

---

## Integration with ASP.NET Core

- Register validators in DI and enable automatic model validation.

```csharp
services.AddControllers()
        .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CreateOrderDtoValidator>());
```

- You can also register `IValidator<T>` explicitly:

```csharp
services.AddTransient<IValidator<CreateOrderDto>, CreateOrderDtoValidator>();
```

- By default FluentValidation integrates with ASP.NET Core's model validation pipeline. Customize behavior with `FluentValidationModelValidatorProvider.Configure(...)` or by disabling automatic validation and invoking validators manually.

---

## Senior-level best practices

- Keep validators thin: validation expresses rules, not business processes. Avoid embedding heavy domain logic or side effects in validators.
- Prefer composition: extract reusable rule sets and nested validators via `SetValidator` or separate `AbstractValidator<T>` types.
- Use `CascadeMode.Stop` when you want to short-circuit rules to reduce noise and unnecessary checks.
- Use `When`/`Unless` sparingly for conditional validation; prefer explicit DTOs per use-case if the validation surface differs greatly.
- For cross-field validation, use `DependentRules` or `Must` on a root object:

```csharp
RuleFor(x => x).Must(x => IsValidCombination(x.Some, x.Other));
```

- Validate externally for expensive checks (network/db) and consider running them asynchronously with `MustAsync`.
- Use `RuleForEach` for collection items and `Include` to reuse other validators.

---

## Testing validators

- Unit test validators directly — instantiating the validator and calling `Validate`/`ValidateAsync` is fast and deterministic.

```csharp
var validator = new CreateOrderDtoValidator();
var result = validator.Validate(dto);
Assert.False(result.IsValid);
Assert.Contains(result.Errors, e => e.PropertyName == "Amount");
```

- Mock external dependencies for async rules using test doubles or extract the dependency behind an interface passed into the validator's constructor.

---

## Error mapping and API responses

- FluentValidation produces `ValidationFailure` objects containing `PropertyName`, `ErrorMessage`, and `AttemptedValue`.
- Map failures to API error response models consistently (problem details, field errors list).
- Consider grouping errors by field and return a compact payload for clients.

---

## Performance considerations

- Avoid expensive synchronous work in rule delegates — prefer async variants.
- If validators call DB or service methods, ensure they are async and avoid N+1 patterns; batch checks where possible (e.g., prefetch referenced ids before validation).
- Keep `CascadeMode` behavior in mind; short-circuit can reduce extra checks.

---

## Advanced topics (senior-level)

- Custom property validators: implement `IPropertyValidator` for reusable complex checks.
- Interceptors: use `IValidatorInterceptor` to hook into validation execution for logging or transformation.
- Validators as filters: using validators within a MediatR pipeline behavior to validate requests before handlers run.

Example MediatR pipeline registration:

```csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var failures = _validators
            .Select(v => v.Validate(request))
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any()) throw new ValidationException(failures);

        return await next();
    }
}
```

- Localization: FluentValidation supports localized messages. Avoid composing error messages in validators; prefer resource keys.
- Using `RuleSet` to group validations by scenario (e.g., `Create`, `Update`) and call specific rule sets when required.

---

## Common pitfalls & how to avoid them

- Do not put persistence or side effects inside validators (e.g., saving logs, sending events).
- Avoid long synchronous I/O (DB or HTTP) that will block the threadpool; use `MustAsync` instead.
- Don't capture scoped services in singletons when injecting services into validators — prefer constructor-injected scoped/transient services and register validators with correct lifetimes.
- Watch for ambiguous `PropertyName` when using `RuleFor(x => x)` root validators — map errors to clear property paths.

---

## Checklist for senior devs when reviewing validation

- Are validators isolated and focused on rules only?
- Are expensive checks async and stubbed in tests?
- Is composition used instead of duplication (Include/SetValidator)?
- Are messages localizable and consistent?
- Are validators registered and resolved correctly in DI (right lifetime)?
- Are validators used in the pipeline (MediatR/Controller) consistently?
- Are cross-field validations explicit and tested?

---

## Quick code snippets

Register validators:

```csharp
services.AddFluentValidationAutoValidation();
services.AddValidatorsFromAssemblyContaining<CreateOrderDtoValidator>();
```

Conditional rule example:

```csharp
RuleFor(x => x.Discount)
    .GreaterThan(0)
    .When(x => x.HasDiscount);
```

Async rule example:

```csharp
RuleFor(x => x.CustomerId)
    .MustAsync(async (id, ct) => await _customerService.Exists(id))
    .WithMessage("Customer not found");
```

---

## Further reading & references

- FluentValidation docs: https://docs.fluentvalidation.net/
- Patterns: using FluentValidation with MediatR, ASP.NET Core model binding, and localization.

---

If you want, I can:
- Add a short example wiring validators into a MediatR pipeline and an ASP.NET Core minimal API sample.
- Add a checklist template for PR/code reviews focusing on validation rules.

***

## Questions & Answers

**Q: When should you reach for FluentValidation over data annotations?**

A: When validation is complex, needs async checks, localization, or cross-field logic. FluentValidation keeps rules in dedicated classes, making them testable and composable, whereas data annotations are limited to attribute-based, synchronous checks.

**Q: How do you share rules between create and update flows?**

A: Use `Include()` to compose validators, `RuleSet` to toggle groups, or separate DTOs per use case. Avoid giant conditional validators—split contexts when rules diverge significantly.

**Q: How do you keep validators from doing business logic?**

A: Limit them to pure validation (checking invariants, referencing read-only dependencies). For workflows or state changes, push logic into application/domain services. Validators can query read models but shouldn’t mutate state or call external systems beyond existence checks.

**Q: What’s the role of `CascadeMode`?**

A: It controls whether subsequent rules run after a failure. `CascadeMode.Stop` short-circuits to reduce noise and redundant work, which is useful for perf or to avoid duplicate messages.

**Q: How do you validate collections?**

A: Use `RuleForEach(x => x.Items).SetValidator(new ItemValidator());` to apply nested validators per element, or `RuleFor(x => x.Items).NotEmpty()` for aggregate-level checks. Each nested validator has access to the child item context.

**Q: How do you handle async validators hitting external services?**

A: Use `MustAsync` or `CustomAsync`, inject the dependency (e.g., repository, API client), and ensure it supports cancellation tokens. Batch expensive checks to avoid N+1 calls.

**Q: How do you integrate FluentValidation with MediatR pipelines?**

A: Register validators in DI and add a pipeline behavior that resolves `IValidator<TRequest>`, executes them before the handler, and throws a `ValidationException` if failures exist. This keeps controllers thin and centralizes validation.

**Q: How do you test validators that depend on services?**

A: Provide fake implementations or mocks for the dependencies, instantiate the validator with them, and assert `Validate` results. Since validators are regular classes, tests run fast without ASP.NET hosting.

**Q: How can you customize error messages for localization?**

A: Use `WithMessage(localizer["Key"])`, configure `ValidatorOptions.Global.LanguageManager`, or override `IStringSource` to supply localized strings. Keep messages in resource files rather than hard-coding text.

**Q: How do you prevent validators from capturing scoped services incorrectly?**

A: Register validators with matching lifetimes (usually transient), inject scoped services via constructor, and avoid static validators. When using `AddValidatorsFromAssemblyContaining`, it defaults to transient, which honors DI scopes.
