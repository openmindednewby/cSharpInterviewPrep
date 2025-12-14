# Claude Code Instructions

> These instructions are automatically loaded by Claude Code at the start of every conversation.

## Primary Instructions

**IMPORTANT:** Always read and follow the comprehensive coding standards in [../UNIVERSAL-CSHARP-AI-INSTRUCTIONS.md](../UNIVERSAL-CSHARP-AI-INSTRUCTIONS.md) before generating any code.

## Quick Reference

This repository uses:
- **Clean Architecture** with CQRS pattern
- **MediatR** for command/query handling
- **FluentValidation** for input validation
- **AutoMapper** for entity-DTO mapping
- **xUnit + Moq + Shouldly** for testing

## Naming Conventions

- Commands: `[Action][Entity]Command.cs`
- Handlers: `[Action][Entity]CommandHandler.cs`
- Queries: `Get[Entity][Details/List]Query.cs`
- Tests: `[Handler]Tests.cs`

## Before Writing Code

1. ✅ Read UNIVERSAL-CSHARP-AI-INSTRUCTIONS.md
2. ✅ Identify the Clean Architecture layer
3. ✅ Determine if Command (write) or Query (read)
4. ✅ Create handler with validator
5. ✅ Write unit tests with AAA pattern

## Repository Context

- This is a C# interview prep repository
- Includes study notes and example solutions
- Domain focus: Trading/fintech systems
- See [AI-INSTRUCTIONS.md](../AI-INSTRUCTIONS.md) for full repository-specific guidance
