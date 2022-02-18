using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindApi.Models;

namespace NorthwindApi.Controllers
{
    [Route("api/product")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ProductController : ControllerBase
    {
        private readonly NorthwindContext _context;
        public ProductController(NorthwindContext context) => _context = context;
        // GET api/product
        [HttpGet]
        public async Task<IActionResult> GetAllProductsAsync() => Ok(await _context.Products.ToListAsync());
        [HttpGet("R")]
        public async Task<ActionResult<IEnumerable<Products>>> GetSomeProductsAsync(int offset,
                                                                                    int limit,
                                                                                    int categoryId = 0)
            => Ok(categoryId > 0 
                ? await _context.Products.Where(p => p.CategoryId == categoryId).Skip(offset).Take(limit).ToListAsync() 
                : await _context.Products.Skip(offset).Take(limit).ToListAsync());
        // GET api/product/c/3
        [HttpGet("C/{id}")]
        public async Task<ActionResult<IEnumerable<Products>>> GetProductsByCategory(int id) => Ok(await (from p in _context.Products
                                                                                                          where p.CategoryId == id
                                                                                                          select p).ToListAsync());
        // GET api/product/10
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetProductByIdAsync(string id)
        {
            Products product = await _context.Products.FindAsync(int.Parse(id));
            return product is null ? (IActionResult)BadRequest("Could not find a product with that id.") : Ok(product);
        }
        // GET api/product/productname/chai
        [HttpGet]
        [Route("productname/{name}")]
        public async Task<IActionResult> GetProductsByName(string name)
        {
            List<Products> products = await (from p in _context.Products
                                             where p.ProductName == name
                                             select p).ToListAsync();
            return products.Count switch
            {
                0 => BadRequest("Could not find any products with that name."),
                _ => Ok(products)
            };
        }
        // GET api/product/supplierid/4
        [HttpGet]
        [Route("supplier/{id}")]
        public async Task<IActionResult> GetProductsBySupplierId(string id)
        {
            List<Products> productsFromSupplier = await (from p in _context.Products
                                                         where p.SupplierId == int.Parse(id)
                                                         select p).ToListAsync();
            return productsFromSupplier.Count switch
            {
                0 => BadRequest("Could not find any products from that supplier id."),
                _ => Ok(productsFromSupplier)
            };
        }
        // GET api/product/categoryid/4
        [HttpGet]
        [Route("categoryid/{id}")]
        public async Task<IActionResult> GetProductsByCategoryId(string id)
        {
            List<Products> productsInCategory = await (from p in _context.Products
                                                       where p.CategoryId == int.Parse(id)
                                                       select p).ToListAsync();
            return productsInCategory.Count switch
            {
                0 => BadRequest("Could not find any products from that supplier id."),
                _ => Ok(productsInCategory)
            };
        }
        // POST api/product
        [HttpPost]
        public async Task<IActionResult> PostProductAsync([FromBody] Products productPost)
        {
            _context.Products.Add(productPost);
            await _context.SaveChangesAsync();
            return Ok($"Order added to database. Id: {productPost.ProductId}");
        }
        // PUT api/product/10
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateProductAsync(string id, [FromBody] Products productUpdate)
        {
            if (!int.TryParse(id, out int idCheck) || productUpdate.ProductId != idCheck)
            {
                return BadRequest();
            }
            Products oldOrder = await _context.Products.FindAsync(int.Parse(id));
            if (oldOrder is null)
            {
                return BadRequest("Could not find a product with that id.");
            }
            foreach (PropertyInfo propertyInfo in productUpdate.GetType().GetProperties())
            {
                //if (!propertyInfo.Name.Equals("ProductId") && propertyInfo.GetValue(productUpdate) != null)
                //{
                //    propertyInfo.SetValue(oldOrder, propertyInfo.GetValue(productUpdate));
                //}
                propertyInfo.SetValue(oldOrder, propertyInfo.GetValue(productUpdate));
            }
            await _context.SaveChangesAsync();
            return Ok($"Product {id} updated.");
        }
        // DELETE api/product/10
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteProductAsync(string id)
        {
            Products product = await _context.Products.FindAsync(int.Parse(id));
            if (product is null)
            {
                return BadRequest("Could not find a product with that id.");
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok($"Product removed from database.");
        }

        // GET: api/products/Shippers
        [HttpGet("shippers")]
        public async Task<ActionResult<IEnumerable<Suppliers>>> GetSuppliers() => await _context.Suppliers.ToListAsync();

        // GET: api/products/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<Categories>>> GetCategories() => await _context.Categories.ToListAsync();
    }
}