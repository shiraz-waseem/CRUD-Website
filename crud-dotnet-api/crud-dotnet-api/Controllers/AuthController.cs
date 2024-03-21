using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using crud_dotnet_api.Data;
using crud_dotnet_api.Model;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace crud_dotnet_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly EmployeeRepository _employeeRepository;
        private readonly JwtOption _options;

        public AuthController(EmployeeRepository employeeRepository, IOptions<JwtOption> options)
        {
            _employeeRepository = employeeRepository;
            _options = options.Value;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto model)
        {
            var employee = await _employeeRepository.GetEmployeeByEmail(model.Email);
            if (employee is null)
            {
                return BadRequest(new { error = "email does not exist" });
            }
            // model.Password is what user told
            if (employee.Password != model.Password)
            {
                return BadRequest(new { error = "email/password is incorrect." });
            }

            var token = GetJWTToken(model.Email);
            return Ok(new { token = token });
        }

        private string GetJWTToken(string email)
        {
            // Generating JWT Token
            var jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
            // with this key we will write a credential
            var credential = new SigningCredentials(jwtKey, SecurityAlgorithms.HmacSha256);

            // Kch info user ki token mein provide krni ha you can. For that we made a list and put user email in it
            List<Claim> claims = new List<Claim>()
            {
                new Claim("Email",email)
            };

            //lets create token. This is security token
            var sToken = new JwtSecurityToken(_options.Key, _options.Issuer, claims, expires: DateTime.Now.AddHours(5), signingCredentials: credential);
            // Security token sy token generate
            var token = new JwtSecurityTokenHandler().WriteToken(sToken);  // JWT Token
            return token;
        }

        [HttpPost("google-login")]
        public async Task<ActionResult> GoogleLogin([FromBody] GoogleLoginDto model)
        {
            var idtoken = model.IdToken;
            var setting = new GoogleJsonWebSignature.ValidationSettings
            {
                // client id
                Audience = new String[] { "57562884338-6ajo3qru0iki7citih7lmit1k8h58ns1.apps.googleusercontent.com" }
            };

            var result = await GoogleJsonWebSignature.ValidateAsync(idtoken, setting);   // result mein data agaya
            if (result is null)
            {
                return BadRequest();
            }
            
            var token = GetJWTToken(result.Email);
           
            return Ok(new { token = token });
        }

        }
}
