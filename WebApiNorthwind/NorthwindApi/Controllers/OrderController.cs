using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindApi.Models;

namespace NorthwindApi.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly NorthwindContext _context;
        public OrderController(NorthwindContext context) => _context = context;
        // GET api/order
        [HttpGet]
        public async Task<IActionResult> GetAllOrdersAsync() => Ok(await _context.Orders.ToListAsync());
        // GET api/order/10248
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetOrderByIdAsync(string id)
        {
            Orders order = await _context.Orders.FindAsync(int.Parse(id));
            return order is null ? (IActionResult)BadRequest("Could not find an order with that id.") : Ok(order);
        }
        // GET api/order/country/finland
        [HttpGet]
        [Route("country/{key}")]
        public async Task<IActionResult> GetOrdersByCountry(string key)
        {
            List<Orders> orders = await (from o in _context.Orders 
                                         where o.ShipCountry == key 
                                         select o).ToListAsync();
            return orders.Count switch
            {
                0 => BadRequest("Could not find any orders to that country."),
                _ => Ok(orders)
            };
        }
        // POST api/order
        [HttpPost]
        public async Task<IActionResult> PostOrderAsync([FromBody] Orders orderPost)
        {
            _context.Orders.Add(orderPost);
            await _context.SaveChangesAsync();
            return Ok($"Order added to database. Id: {orderPost.OrderId}");
        }
        // PUT api/order/10248
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateOrderAsync(string id, [FromBody] Orders orderUpdate)
        {
            if (!int.TryParse(id, out int idCheck) || idCheck != orderUpdate.OrderId)
            {
                return BadRequest();
            }
            Orders oldOrder = await _context.Orders.FindAsync(int.Parse(id));
            if (oldOrder is null)
            {
                return BadRequest("Could not find an order with that id.");
            }
            foreach (PropertyInfo propertyInfo in orderUpdate.GetType().GetProperties())
            {
                //if (!propertyInfo.Name.Equals("OrderId") && propertyInfo.GetValue(orderUpdate) != null)
                //{
                //    propertyInfo.SetValue(oldOrder, propertyInfo.GetValue(orderUpdate));
                //}
                propertyInfo.SetValue(oldOrder, propertyInfo.GetValue(orderUpdate));
            }
            await _context.SaveChangesAsync();
            return Ok($"Order {id} updated.");
        }
        // DELETE api/order/10248
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteOrderAsync(string id)
        {
            Orders order = await _context.Orders.FindAsync(int.Parse(id));
            if (order is null)
            {
                return BadRequest("Could not find an order with that id.");
            }
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return Ok($"Order removed from database.");
        }
    }
}