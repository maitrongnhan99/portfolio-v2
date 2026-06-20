                                                                                                          
  import nextVitals from 'eslint-config-next/core-web-vitals'                            
                                                                                                            
  const eslintConfig = [                                                                                  
    ...nextVitals,                                                                                          
    {                                                                                    
      ignores: [                         
        '.next/**',                                                                                         
        'node_modules/**',               
        'dist/**',                                                                                          
        'build/**',                                                                      
        'out/**',                                                                                           
        '*.min.js',                                                                                         
        'coverage/**',                                                                                      
        '.nyc_output/**',                                                                                   
        'payload-types.ts',                                                                                 
      ],                                                                                                    
    },                                                                                                      
  ]                                                                                                         
                                                                                                            
  export default eslintConfig  