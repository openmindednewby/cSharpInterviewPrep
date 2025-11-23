using Application.Features.LeaveType.Queries.GetAllLeaveTypes;
using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MappingProfiles
{
    public class LeaveTypeProfile : Profile
    {
        public LeaveTypeProfile() {
            CreateMap<LeaveTypeDto, LeaveType>().ReverseMap();
            CreateMap<LeaveType, LeaveTypeDetailsDto>();
        }
    }
}
