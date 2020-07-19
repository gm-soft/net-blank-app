using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Utils.Interfaces;

namespace Company.Core.Api.Controllers
{
    public abstract class BaseRestController<TModel, TCrudService> : ControllerBase
        where TModel : class, IBaseModel
        where TCrudService : ICrudService<TModel>
    {
        protected TCrudService Service { get; }

        public BaseRestController(TCrudService service)
        {
            Service = service;
        }

        /// <summary>
        /// Returns a single entity by a passed id.
        /// </summary>
        /// <param name="id">Entity id.</param>
        /// <returns>Entity.</returns>
        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetByIdAsync([FromRoute] long id)
        {
            TModel entity = await Service.GetByIdAsync(id);

            return Ok(entity);
        }

        /// <summary>
        /// Returns all entities.
        /// </summary>
        /// <returns>All entities.</returns>
        [HttpGet("")]
        public virtual async Task<IActionResult> GetAllAsync()
        {
            IReadOnlyCollection<TModel> models = await Service.GetAllAsync();
            return Ok(models);
        }

        /// <summary>
        /// Creates a new entity from a passed data.
        /// </summary>
        /// <param name="model">Instance to create.</param>
        /// <returns>Ok.</returns>
        [HttpPost]
        public virtual async Task<IActionResult> CreateAsync([FromBody] TModel model)
        {
            await Service.InsertAsync(model);
            return Ok();
        }

        /// <summary>
        /// Updates an existing entity with a passed data.
        /// </summary>
        /// <param name="model">Instance to update.</param>
        /// <returns>Ok.</returns>
        [HttpPut("")]
        public virtual async Task<IActionResult> UpdateAsync([FromBody] TModel model)
        {
            await Service.UpdateAsync(model);
            return Ok();
        }

        /// <summary>
        /// Deletes an existing entity by passed id.
        /// </summary>
        /// <param name="id">Id of the entity to delete.</param>
        /// <returns>Ok.</returns>
        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> DeleteAsync([FromRoute] long id)
        {
            await Service.DeleteAsync(id);
            return Ok();
        }
    }
}