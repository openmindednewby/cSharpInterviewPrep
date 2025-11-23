using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.LeaveType.Queries.GetAllLeaveTypes
{
    public class LeaveTypeDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public int DefaultDays { get; set; }
    }
}
