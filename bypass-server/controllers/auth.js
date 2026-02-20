import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Handle user login with email and password
 * POST body: { email, password }
 * Returns: { session, user } on success, { error } on failure
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabase.rpc('authenticate_user_and_generate_token', {
      p_email: req.body.email,
      p_password: req.body.password
    });

    if (error) {
      console.error('Supabase login error:', error)
      return res.status(401).json({ error: error.message || 'Login failed' })
    }

    // if (!data.session) {
    //   return res.status(500).json({ error: 'No session returned from Supabase' })
    // }

    const authenticatedUser = data[0];
    return res.status(200).json(authenticatedUser);

    // Return session token and user info
    // return res.json({
    //   session: {
    //     access_token: data.session.access_token,
    //     refresh_token: data.session.refresh_token,
    //     expires_in: data.session.expires_in,
    //     expires_at: data.session.expires_at
    //   },
    //   user: {
    //     id: data.user.id,
    //     email: data.user.email,
    //     user_metadata: data.user.user_metadata
    //   }
    // })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Handle user signup with email and password
 * POST body: { email, password }
 * Returns: { session, user } on success, { error } on failure
 */
export async function signup(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('Supabase signup error:', error)
      return res.status(400).json({ error: error.message || 'Signup failed' })
    }

    // Return session and user info (may not have session if email confirmation required)
    return res.status(201).json({
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
            expires_at: data.session.expires_at
          }
        : null,
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata
      },
      message: 'Signup successful. Check your email for confirmation if required.'
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Handle user logout (client-side token deletion, server just acknowledges)
 */
export async function logout(req, res) {
  try {
    return res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({ error: 'Logout failed' })
  }
}
