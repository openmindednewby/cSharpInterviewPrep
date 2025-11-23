using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.LeaveType.Queries.GetAllLeaveTypes
{
    internal class GetLeaveTypesQueryHandler : IRequestHandler<GetLeaveTypesQuery, List<LeaveTypeDto>>
    {
        public Task<List<LeaveTypeDto>> Handle(GetLeaveTypesQuery request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
