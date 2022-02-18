using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindApi.Models;

namespace NorthwindApi.Controllers
{
    [Route("api/customers")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CustomersController : ControllerBase
    {
        private readonly NorthwindContext _context;

        public CustomersController(NorthwindContext context) => _context = context;

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customers>>> GetCustomers() => await _context.Customers.ToListAsync();

        // GET: api/Customers/r?offset=0&limit=10
        [HttpGet("R")]
        public async Task<ActionResult<IEnumerable<Customers>>> GetSetOfCustomers(int offset,
                                                                                  int limit,
                                                                                  string country)
            => Ok(!string.IsNullOrWhiteSpace(country)
                ? await _context.Customers.Where(c => c.Country.Contains(country)).Skip(offset).Take(limit).ToListAsync()
                : await _context.Customers.Skip(offset).Take(limit).ToListAsync());

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customers>> GetCustomers(string id)
        {
            var customers = await _context.Customers.FindAsync(id);

            if (customers is null)
            {
                return NotFound();
            }

            return customers;
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomers(string id, Customers customers)
        {
            if (id.ToUpper() != customers.CustomerId)
            {
                return BadRequest();
            }

            _context.Entry(customers).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException dbEx)
            {
                if (!await CustomersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return BadRequest($"Could not update the customer.\n{dbEx.Message}\n{dbEx.InnerException}");
                }
            }

            return Ok($"Customer {customers.CustomerId} updated");
        }

        // POST: api/Customers
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Customers>> PostCustomers(Customers customers)
        {
            _context.Customers.Add(customers);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                if (await CustomersExists(customers.CustomerId))
                {
                    return Conflict();
                }
                else
                {
                    return BadRequest($"{dbEx.Message}\n{dbEx.InnerException.Message}");
                }
            }

            return CreatedAtAction("GetCustomers", new { id = customers.CustomerId }, customers);
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Customers>> DeleteCustomers(string id)
        {
            var customers = await _context.Customers.FindAsync(id);
            if (customers is null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customers);
            await _context.SaveChangesAsync();

            return customers;
        }

        private async Task<bool> CustomersExists(string id) => await _context.Customers.FindAsync(id) != null;
    }
}
