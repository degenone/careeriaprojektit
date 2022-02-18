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
using NorthwindApi.Services;

namespace NorthwindApi.Controllers
{
    /// <summary>
    /// Tämä on tehty käyttäen komentoa: 
    /// Scaffold-DbContext "Server=LAPTOP-66I5K9TG\SQLEXPRESSTEROKI;Database=northwind;Trusted_Connection=True;" 
    /// Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models 
    /// -Tables "Customers","Employees", "Orders", "Order Details", "Products", "ReactLogins", "Suppliers", "Categories" -Force
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ReactLoginController : ControllerBase
    {
        private readonly NorthwindContext _context;
        private readonly IAuthenticateService _authenticateService;
        public ReactLoginController(NorthwindContext context, IAuthenticateService authenticateService)
        {
            _context = context;
            _authenticateService = authenticateService;
        }

        // GET: api/ReactLogin
        //[HttpGet]
        //[AllowAnonymous]
        //public async Task<ActionResult<IEnumerable<ReactLogins>>> GetReactLogins() => await _context.ReactLogins.ToListAsync();

        // POST: api/ReactLogin
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> LoginReactLogins(LoginModel login)
        {
            ReactLogins user = await _context.ReactLogins.SingleOrDefaultAsync(
                u => u.Username == login.Username && u.Password == login.Password);
            
            if (user is null)
            {
                return NotFound();
            }
            FrontEndUserModel loggedUser = new FrontEndUserModel
            {
                LoginId = user.LoginId,
                Etunimi = user.Etunimi,
                Sukunimi = user.Sukunimi,
                Email = user.Email,
                Username = user.Username,
            };
            _authenticateService.Autheticate(loggedUser);
            return Ok(loggedUser);
        }

        // GET: api/ReactLogin/user1
        [HttpGet("{username}")]
        public async Task<ActionResult<FrontEndUserModel>> GetReactLogins(string username)
        {
            var user = await _context.ReactLogins.SingleOrDefaultAsync(u => u.Username == username);

            if (user is null)
            {
                return NotFound();
            }

            return new FrontEndUserModel 
            { 
                LoginId = user.LoginId, 
                Etunimi = user.Etunimi, 
                Sukunimi = user.Sukunimi, 
                Email = user.Email, 
                Username = user.Username 
            };
        }

        // PUT: api/ReactLogin/ResetPassword/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("resetpassword/{id}")]
        public async Task<IActionResult> PutResetPasswordReactLogins(int id, ResetPasswordModel reset)
        {
            ReactLogins user = await _context.ReactLogins.FindAsync(id);
            if (user.Password != reset.OldPassword)
            {
                return BadRequest();
            }

            user.Password = reset.NewPassword;
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await UserExistsAsync(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // PUT: api/ReactLogin/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReactLogins(int id, FrontEndUserModel userUpdate)
        {
            if (id != userUpdate.LoginId)
            {
                return BadRequest();
            }

            ReactLogins user = await _context.ReactLogins.SingleOrDefaultAsync(u => u.Username == userUpdate.Username);
            if (user != null && user.LoginId != id)
            {
                return Conflict();
            }

            user ??= await _context.ReactLogins.FindAsync(id);
            if (user is null)
            {
                return NotFound();
            }
            user.Etunimi = userUpdate.Etunimi;
            user.Sukunimi = userUpdate.Sukunimi;
            user.Email = userUpdate.Email;
            user.Username = userUpdate.Username;
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(new FrontEndUserModel
            {
                LoginId = user.LoginId,
                Etunimi = user.Etunimi,
                Sukunimi = user.Sukunimi,
                Email = user.Email,
                Username = user.Username,
            });
        }

        // POST: api/ReactLogin
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<ReactLogins>> PostReactLogins(ReactLogins user)
        {
            if (await _context.ReactLogins.SingleOrDefaultAsync(u => u.Username == user.Username) != null)
            {
                return Conflict();
            }
            _context.ReactLogins.Add(user);
            await _context.SaveChangesAsync();
            FrontEndUserModel newUser = new FrontEndUserModel
            {
                LoginId = user.LoginId,
                Etunimi = user.Etunimi,
                Sukunimi = user.Sukunimi,
                Email = user.Email,
                Username = user.Username,
            };
            _authenticateService.Autheticate(newUser);
            return Ok(newUser);
        }

        // DELETE: api/ReactLogin/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ReactLogins>> DeleteReactLogins(int id)
        {
            var user = await _context.ReactLogins.FindAsync(id);
            if (user is null)
            {
                return NotFound();
            }

            _context.ReactLogins.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private async Task<bool> UserExistsAsync(int id) => await _context.ReactLogins.FindAsync(id) != null;
    }
}
