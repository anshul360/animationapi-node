import { Headers } from "node-fetch";
import crypto from "crypto";
import base64url from 'base64url';
import Api from "./api";

const API_ENDPOINT = "https://api.animationapi.com/v1";
const API_ENDPOINT_SYNCHRONOUS = "https://sync.api.animationapi.com/v1"

interface CreateImageParams { modifications: any[], webhook_url?: string | null, transparent?: boolean, render_pdf?: boolean, metadata?: string | null }
interface CreateAnimationParams { input_media_url: string, modifications: any[], blur?: number, trim_to_length_in_seconds?: number, webhook_url?: string, metadata?: string | null, frames?: any[], frame_duration?: any[], create_gif_preview?: boolean }


export interface Image {
  template_id: string;
  created_at: string;
  uid: string;
  public_url: string;
  type: "jpeg" | "png" | "webp";
  quality?: number;
  pixel_ratio?: number;
  modifications: any[] | null;
  transparent: boolean;
  metadata: any[] | null;
}

export interface Status {
  status: "pending" | "in_progress" | "completed";
  status_url: string;
  asset_url?: string;
}

export interface Animation {
  template_id: string;
  created_at: string;
  uid: string;
  public_url: string;
  type: "webm" | "mp4" | "gif";
  modifications: any[] | null;
  metadata: any[] | null;
}

export interface Account {
  created_at: string;
  uid: string;
  paid_plan_name: string;
  image_api_quota: number;
  image_api_usage_this_month: number;
  animation_api_quota: number;
  animation_api_usage_this_month: number;
}

export class AnimationAPI {
  private api;
  private syncApi;
  private token: string;

  constructor(apiToken?: string) {
    this.token = apiToken || String(process.env['ANIMATIONAPI_API_KEY']);
    this.api = new Api(new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }), API_ENDPOINT);
    this.syncApi = new Api(new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    }), API_ENDPOINT_SYNCHRONOUS);
  }


  public async account(): Promise<Account> {
    return this.api.get('/account') as Promise<Account>
  }

  public async get_image(uid: string): Promise<Image> {
    return this.api.get(`/images/${uid}`) as Promise<Image>
  }


  public async list_images(page?: number, limit?: number): Promise<Image[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    if (limit) queryString.push(`limit=${limit}`)
    return this.api.get(`/images${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<Image[]>
  }

  public async create_image(uid: string, params: CreateImageParams, synchronous: boolean = false): Promise<Image> {
    if (synchronous) {
      return this.syncApi.post('/images', { ...params, template: uid }) as Promise<Image>
    }

    return this.api.post('/images', { ...params, templateId: uid }) as Promise<Image>
  }
  
  public async get_animation(uid: string): Promise<Animation> {
    return this.api.get(`/animations/${uid}`) as Promise<Animation>
  }

  public async list_animations(page?: number): Promise<Animation[]> {
    let queryString = [];
    if (page) queryString.push(`page=${page}`)
    return this.api.get(`/animations${queryString.length > 0 ? `?` + queryString.join('&') : '' }`) as Promise<Animation[]>
  }

  public async create_animation(uid: string, params: CreateAnimationParams): Promise<Animation> {
    return this.api.post('/animations', { ...params, animation_template: uid }) as Promise<Animation>
  }

  public async generate_signed_url(base_id: string, modifications: any, synchronous = false): Promise<string> {
    const base = `https://${synchronous ? 'cdn' : 'ondemand'}.animationapi.com/signedurl/${base_id}/image.jpg`
    const query = `?modifications=${base64url(JSON.stringify(modifications))}`
    const signature = crypto.createHmac('sha256', this.token).update(`${base}${query}`).digest('hex')
    return `${base}${query}&s=${signature}`
  }
}

export default AnimationAPI;
