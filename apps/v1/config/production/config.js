module.exports = {
    "version": '0.0.1',
    "asset_version": '0.0.1',
    "header_key": "wknd-token",
    company_name: "Weekend Inc",
    base_url: "http://localhost:2007", // pada production, ubah terlebih dahulu
    client_url: "http://127.0.0.1:3000", // pada production, ubah terlebih dahulu
    token_match_ip: false,
    allowed_no_header: ['/api/token/'],
    check_header: ['/api/'],
    allowed_origin:['localhost', '192.168.*', '127.*', '::1'],
    allowed_method:['GET', 'POST', 'PUT', 'DELETE'], 
    allowed_credentials: true,
      /* untuk diperhatikan allowed_origin:
     1. jangan menggunakan * apabila sudah di domain
     2. http dan https perlu dicantumkan dalam allowed_origin. misal:
            http://nama-website.com
            https://nama-website.com
     */
    logged_page: [],
    static_files: ['uploads', 'assets', 'export-data'],
    static_paths: ['/uploads', '/assets' , '/uploads'],
    forbidden_path: "export-data",
    max_timeout:300000, //in milliseconds
    max_post_size: '100mb',
    sitekey: "6LfBa3kUAAAAAOFL4-GQX-7dEyQkkUydgyIKcVm-",
    secretkey : '6LfBa3kUAAAAAL6QnuweWFARsFrV5Fje-vRXBz4P',
    session_expired: 86400000, //in milliseconds
    session_secret: 'We3kenD!nc',
    session_name: 'wknd_session',
    csrf_protection : true,
    csrf_token_name : 'wknd_csrf',
    csrf_bypass: ['/token'],
    validate_admin: ['/cms/'], // false / ['/cms/'] (False to turn off validate admin when restart the server)
    login_admin: '/cms/login/',
    max_csrf: 10,
    recaptcha: false, // true = on
    disposable_email: true, //true = on
    // content security policy, listed domain whitelisted to be accessed by server, 
    csp:{
        defaultSrc:["'self'"],
        scriptSrc: [
            "'self'", 
            "'unsafe-inline'","'unsafe-eval'",
            "cdn.quilljs.com",'maps.google.com','www.google.com','www.gstatic.com',
            'maps.googleapis.com'
        ],
        styleSrc:[
            "'self'",
            "'unsafe-inline'",'fonts.googleapis.com',"cdn.quilljs.com"
        ],
        fontSrc:[
            "'self'", 
            'fonts.googleapis.com','fonts.gstatic.com'
        ],
        imgSrc:[
            "'self'",'http: https: data: blob:'
        ],
        mediaSrc: [
            "'self'", 'http: https:'
        ]
    },
    // http strict transport security, header to tells browser to prefer HTTPS over insecure HTTP
    hsts:{
        maxAge: 5184000, // sixtyDaysInSeconds
        includeSubDomains: true,
        preload: true
    },
    // header whitch controls what info is set in the Refere header, https://helmetjs.github.io/
    referrerPolicy:{
        policy:'same-origin'
    },

    // Cloud Storage Config (Alibaba OSS or AWS S3)
    cs_name: [''], // S3 or OSS or more than one
    cs_bucket_domain: [''],
    cs_bucket_name: [''],
    cs_region: [''],
    cs_access_key_id: [''],
    cs_access_key_secret: [''],

    // Asset url (if asset is hosted in s3 or cdn)
    asset_url: '',

    // For clean token log handling
    log_path: './logs',
    log_exceptions: ['service.log'],
    log_backdate: 7, // in days

    masked_params: ['password', 'old_password', 'confirm_password'],
}
