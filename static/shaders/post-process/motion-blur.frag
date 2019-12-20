#version 300 es
precision highp float;

//TODO: Modify as needed
in vec2 v_screencoord;
out vec4 color;
uniform sampler2D color_sampler;
uniform sampler2D motion_sampler;
uniform sampler2D depth_sampler;
uniform mat4  VP_I;
uniform mat4 VP_PREV;

void main(){
    color = texture(color_sampler, v_screencoord); // Sample texture color and send it as is
    vec4 motion_vector = texture(motion_sampler,v_screencoord); 
    float depth = texture(depth_sampler, v_screencoord).x; // read the depth from the depth texture
    vec4 NDC_new = vec4(2.0*v_screencoord.x-1.0,2.0*v_screencoord.y-1.0,2.0*depth-1.0,1.0);
    NDC_new /= NDC_new.w;
    vec4 P_new = VP_I * NDC_new;
    P_new /= P_new.w;   
    vec4 P_old = P_new - motion_vector; 
    vec4 NDC_old = VP_PREV * P_old;
    NDC_old /= NDC_old.w;
    vec2 v_screencoord_old = 0.5 * (NDC_old.xy + 1.0);
 
    vec2 steps = (v_screencoord-v_screencoord_old)/32.0;
   
    ivec2 size = textureSize(color_sampler,0);
    vec2 tex_size = 1.0/vec2(size);
    float tex = length(v_screencoord- v_screencoord_old)/length(tex_size);

    float two_sigma_sqr = 2.0 *40.0* 40.0;
    float total_wight = 0.0;
    color = vec4(0);
    for(float i = 0.0 ; i <32.0; i++)
    {
        float weight  = exp( - float(i*i)/two_sigma_sqr);
        color += texture(color_sampler, v_screencoord- i * steps) * weight;
        total_wight += weight;
    }
    color /= total_wight;
}