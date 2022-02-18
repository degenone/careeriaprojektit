using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindApi.Models;

namespace NorthwindApi.Controllers
{
    [Route("api/employee")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly NorthwindContext _context;
        public EmployeeController(NorthwindContext context) => _context = context;
        // GET api/employee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employees>>> GetEmployees() => await _context.Employees.ToListAsync();

        // GET api/employee/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Employees>> GetEmployee(string id)
        {
            Employees employee = await _context.Employees.FindAsync(int.Parse(id));
            if (employee is null)
            {
                return BadRequest("No employee found with that id.");
            }
            return Ok(employee);
        }
        // GET api/employee/country/usa
        [HttpGet("country/{key}")]
        public async Task<ActionResult<IEnumerable<Employees>>> GetEmployeesByCountry(string key)
        {
            List<Employees> employees = await (from e in _context.Employees
                                               where e.Country == key
                                               select e).ToListAsync();
            return employees.Count switch
            {
                0 => BadRequest("No employees from that country"),
                _ => Ok(employees)
            };
        }
        // POST api/employee
        [HttpPost]
        public async Task<ActionResult<Employees>> PostEmployee(Employees employee)
        {
            _context.Employees.Add(employee);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest($"Could not post employee.\n{ex.Message}\n{ex.InnerException.Message}");
            }
            return Ok($"Employee {employee.EmployeeId} created.");
        }
        // PUT api/employee/14
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(string id, Employees employee)
        {
            if (int.Parse(id) != employee.EmployeeId)
            {
                return BadRequest("Check employee id.");
            }
            _context.Entry(employee).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest($"Could not update employee information.\n{ex.Message}\n{ex.InnerException.Message}");
            }
            return Ok($"Employee {employee.EmployeeId} updated.");
        }
        // DELETE api/employee/14
        [HttpDelete("{id}")]
        public async Task<ActionResult<Employees>> DeleteEmployee(string id)
        {
            Employees employee = await _context.Employees.FindAsync(int.Parse(id));
            if (employee is null)
            {
                return BadRequest("No employee found with that id.");
            }
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return Ok("Employee removed.");
        }
    }
}