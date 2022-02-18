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
    [Route("api/orderdetail")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly NorthwindContext _context;
        public OrderDetailController(NorthwindContext context) => _context = context;
        // GET api/orderdetail
        [HttpGet]
        public async Task<IActionResult> GetAllOrderDetailsAsync() => Ok(await _context.OrderDetails.ToListAsync());
        // GET api/orderdetail/10248/11
        [HttpGet]
        [Route("{orderid}/{productid}")]
        public async Task<IActionResult> GetOrderDetailByIdsAsync(string orderId, string productId)
        {
            OrderDetails orderDetails = await _context.OrderDetails.FindAsync(int.Parse(orderId), int.Parse(productId));
            return orderDetails is null
                ? (IActionResult)BadRequest("Could not find details of an order with those ids.")
                : Ok(orderDetails);
        }
        // GET api/orderdetail/orderid/10248
        [HttpGet]
        [Route("orderid/{id}")]
        public async Task<IActionResult> GetOrderDetailsById(string id)
        {
            List<OrderDetails> orderDetails = await (from od in _context.OrderDetails
                                                     where od.OrderId == int.Parse(id)
                                                     select od).ToListAsync();
            return orderDetails.Count switch
            {
                0 => BadRequest("Could not find details of an order with that id."),
                _ => Ok(orderDetails)
            };
        }
        //GET api/productid/4
        [HttpGet]
        [Route("productid/{id}")]
        public async Task<IActionResult> GetOrderDetailsByProductId(string id)
        {
            List<OrderDetails> orderDetails = await (from od in _context.OrderDetails
                                                     where od.ProductId == int.Parse(id)
                                                     select od).ToListAsync();
            return orderDetails.Count switch
            {
                0 => BadRequest("Could not find any details for orders with that product id."),
                _ => Ok(orderDetails)
            };
        }
        // GET api/orderdetail/discount/5
        [HttpGet]
        [Route("discount/{percent}")]
        public async Task<IActionResult> GetOrderDetailsByDiscount(string percent)
        {
            List<OrderDetails> orderDetails = await (from od in _context.OrderDetails
                                                     where od.Discount == (float.Parse(percent) / 100)
                                                     select od).ToListAsync();
            return orderDetails.Count switch
            {
                0 => BadRequest("Could not find any details for orders with that discount."),
                _ => Ok(orderDetails)
            };
        }
        // POST api/orderdetail
        [HttpPost]
        public async Task<IActionResult> PostOrderDetailAsync([FromBody] OrderDetails orderDetailPost)
        {
            _context.OrderDetails.Add(orderDetailPost);
            await _context.SaveChangesAsync();
            return Ok($"Order added to database. Id: order:{orderDetailPost.OrderId}, product: {orderDetailPost.ProductId}");
        }
        // Doesn't pass anything to db, only informs user of proper put method.
        [HttpPut]
        [Route("{id}")]
        public IActionResult UnsuccesfullPut() 
            => BadRequest("To update order details both order and product ids are needed. E.g. \"api/orderdetail/10248/42\"");
        // PUT api/orderdetail/10248/42
        [HttpPut]
        [Route("{orderid}/{productid}")]
        public async Task<IActionResult> UpdateOrderDetailAsync(string orderId, string productId, [FromBody] OrderDetails orderDetailUpdate)
        {
            if (!int.TryParse(orderId, out int oId) || !int.TryParse(productId, out int pId) || orderDetailUpdate.OrderId != oId || orderDetailUpdate.ProductId != pId)
            {
                return BadRequest();
            }
            OrderDetails oldOrderDetail = await _context.OrderDetails.FindAsync(int.Parse(orderId), int.Parse(productId));
            if (oldOrderDetail is null)
            {
                return BadRequest("Could not find details of an order with that id.");
            }
            foreach (PropertyInfo propertyInfo in orderDetailUpdate.GetType().GetProperties())
            {
                //if (!propertyInfo.Name.Equals("OrderId") && !propertyInfo.Name.Equals("ProductId") && propertyInfo.GetValue(orderDetailUpdate) != null)
                //{
                //    propertyInfo.SetValue(oldOrderDetail, propertyInfo.GetValue(orderDetailUpdate));
                //}
                propertyInfo.SetValue(oldOrderDetail, propertyInfo.GetValue(orderDetailUpdate));
            }
            await _context.SaveChangesAsync();
            return Ok($"Order details for order id: {orderId}, product id: {productId} updated.");
        }
        // Doesn't delete anything from db, only informs user of proper delete method.
        [HttpDelete]
        [Route("{id}")]
        public IActionResult UnsuccesfullDelete() 
            => BadRequest("To delete order details both order and product ids are needed. E.g. \"api/orderdetail/10248/42\"");
        // DELETE api/orderdetail/10248
        // should this also have product id? should a delete on ordercontroller also delete here?
        [HttpDelete]
        [Route("{orderid}/{productid}")]
        public async Task<IActionResult> DeleteOrderDetailAsync(string orderId, string productId)
        {
            OrderDetails orderDetail = await _context.OrderDetails.FindAsync(int.Parse(orderId), int.Parse(productId));
            if (orderDetail is null)
            {
                return BadRequest("Could not find details of an order with that id.");
            }
            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();
            return Ok($"Order details removed from database.");
        }
    }
}