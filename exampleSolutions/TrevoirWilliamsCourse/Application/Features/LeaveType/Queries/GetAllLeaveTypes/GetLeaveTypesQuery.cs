using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.LeaveType.Queries.GetAllLeaveTypes
{
    public record GetLeaveTypesQuery : IRequest<List<LeaveTypeDto>>;
}
