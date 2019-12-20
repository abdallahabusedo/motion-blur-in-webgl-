#version 300 es

//TODO: Modify as needed
layout(location=0) in vec3 position;
layout(location=1) in vec4 color;
layout(location=2) in vec2 texcoord;
out vec4 v_color;
out vec2 v_texcoord;
out vec4 motion_vector;
uniform mat4 M;
uniform mat4 VP;
uniform mat4 M_PR;
void main(){
    vec4 world = M * vec4(position, 1.0f);
    gl_Position = VP * world; 
    vec4 prev = M_PR * vec4(position,1.0f);
    v_color = color;
    v_texcoord = texcoord;
    motion_vector =  world - prev ;
}