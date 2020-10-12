class BuiltInFunctions {

	// this = GML

	// Please organize this in the style of the game maker help documentation

	// # Computing things

	// ## Real-valued functions

	static abs ([x]) {
		return Math.abs(x);
	}
	static arccos ([x]) {
		return Math.acos(x);
	}
	static arcsin ([x]) {
		return Math.asin(x);
	}
	static arctan ([x]) {
		return Math.atan(x);
	}
	static arctan2 ([x]) {
		return Math.atan2(x);
	}
	static ceil ([x]) {
		return Math.ceil(x);
	}
	static choose ([...vals]) {
		return vals[Math.floor((Math.random()*vals.length))];
	}
	static cos ([x]) {
		return Math.cos(x);
	}
	static degtorad ([x]) {
		return x * this.game.constants.pi / 180;
	}
	static exp ([x]) {
		return Math.exp(x);
	}
	static floor ([x]) {
		return Math.floor(x);
	}
	static frac ([x]) {
		return x % 1;
	}
	static irandom ([x]) {
		return Math.floor(Math.random() * (Math.floor(x) + 1));
	}
	static irandom_range ([x1, x2]) {
		return Math.floor(Math.random() * (Math.floor(x1) - Math.floor(x2) + 1)) + Math.floor(x2);
	}
	static is_real ([x]) {
		return (typeof x == 'number');
	}
	static is_string ([x]) {
		return (typeof x == 'string');
	}
	static lengthdir_x ([len, dir]) {
		return Math.cos(dir * this.game.constants.pi / 180) * len;
	}
	static lengthdir_y ([len, dir]) {
		return Math.sin(dir * this.game.constants.pi / 180) * len;
	}
	static ln ([x]) {
		return Math.log(x);
	}
	static log10 ([x]) {
		return Math.log10(x);
	}
	static log2 ([x]) {
		return Math.log2(x);
	}
	static logn ([x, n]) {
		return Math.log(x) / Math.log(n);
	}
	static max ([...vals]) {
		return Math.max(...vals);
	}
	static mean ([...vals]) {
		if (vals.length == 0) return 0;
		return vals.reduce((a, b) => a+b) / vals.length;
	}
	static min ([...vals]) {
		return Math.min(...vals);
	}
	static point_direction ([x1, y1, x2, y2]) {
		return Math.atan2(y2 - y1, x2 - x1) * 180 / this.game.constants.pi;
	}
	static point_distance ([x1, y1, x2, y2]) {
		return Math.hypot(x2 - x1, y2 - y1);
	}
	static power ([x, n]) {
		return Math.pow(x, n);
	}
	static radtodeg ([x]) {
		return x * 180 / this.game.constants.pi;
	}
	static random ([x]) {
		return Math.random() * x;
	}
	static random_range ([x1, x2]) {
		return (Math.random() * (x2-x1)) + x1;
	}
	static round ([x]) {
		return Math.round(x);
	}
	static sign ([x]) {
		return Math.sign(x);
	}
	static sin ([x]) {
		return Math.sin(x);
	}
	static sqr ([x]) {
		return x*x;
	}
	static sqrt ([x]) {
		return Math.sqrt(x);
	}
	static tan ([x]) {
		return Math.tan(x);
	}

	// ## String handling functions
	static chr ([val]) {
		return String.fromCharCode(val);
	}
	static string ([val]) {
		return val.toString();
	}
	static ord ([str]) {
		return str.charCodeAt(0);
	}
	static real ([str]) {
		return parseDouble(str);
	}

	// # Game play

	// ## Moving around

	static move_snap ([hsnap, vsnap]) {
		this.currentInstance.variables.x = Math.floor(this.currentInstance.variables.x / hsnap) * hsnap;
		this.currentInstance.variables.y = Math.floor(this.currentInstance.variables.y / vsnap) * vsnap;
		return 0;
	}
	static move_towards_point ([x, y, sp]) {
		this.currentInstance.variables.speed = sp;
		this.currentInstance.variables.direction = Math.atan2(x, y) * 180 / this.game.constants.pi;
		return 0;
	}
	static place_snapped ([hsnap, vsnap]) {
		return (this.currentInstance.variables.x % hsnap == 0) && (this.currentInstance.variables.y % vsnap == 0)
	}

	// ## Instances

	static instance_create ([x, y, obj]) {
		return this.game.instanceCreate(x, y, obj);
	}
	static instance_destroy ([]) {
		this.game.shouldDestroyInstances.push(this.currentInstance);
		return 0;
	}
	static instance_exists ([obj]) {

		var instancesWithoutDeleted = this.game.instances.filter(x =>
				!this.game.shouldDestroyInstances.includes(x));

		var i;
		if (obj < 0) { // is keyword
			if (obj == -1) {
				i = instancesWithoutDeleted.find(x => x == this.currentInstance);
			} else
			//other: -2,
			if (obj == -3) {
				i = (instancesWithoutDeleted.length > 0);
			} else {
				i = false;
			}
		} else if (obj < 100000) { // is object
			i = instancesWithoutDeleted.find(x => x.object_index == obj);
		} else { // is id
			i = instancesWithoutDeleted.find(x => x.id == obj);
		}

		return (i ? 1 : 0);
	}

	// ## Rooms

	static room_goto ([numb]) {
		loadRoom(this.game.project.ProjectRoom.find(x => x.id == numb));
		return 0;
	}
	static game_end ([]) {
		this.game.shouldEnd = true;
		return 0;
	}

	// # User interaction

	// ## The keyboard

	static keyboard_check ([key]) {
		return this.game.key[key] ? 1 : 0;
	}
	static keyboard_check_pressed ([key]) {
		return this.game.keyPressed[key] ? 1 : 0;
	}
	static keyboard_check_released ([key]) {
		return this.game.keyReleased[key] ? 1 : 0;
	}

	// # Game graphics

	// ## Drawing sprites and backgrounds
	static draw_sprite ([sprite, subimg, x, y]) {

		if (sprite >= 0) {
			var sprite = this.game.project.resources.ProjectSprite.find(x => x.id == sprite)
			if (sprite) {
				if (sprite.images[subimg]) {
					this.game.ctx.save();
					this.game.ctx.translate(-sprite.originx, -sprite.originy);
					this.game.ctx.drawImage(sprite.images[subimg].image, x, y);
					this.game.ctx.restore();
				} else {
					throw 'No subimage with index '+subimg+' on sprite '+sprite.name;
				}
			} else {
				throw 'No sprite with index '+sprite;
			}
		} else {
			throw sprite+' cannot be less than 0';
		}

		return 0;
	}

	// ## Drawing shapes

	static color_get_red ([col]) {
		return col % 256;
	}
	static color_get_green ([col]) {
		return Math.floor(col % (256*256) / 256);
	}
	static color_get_blue ([col]) {
		return Math.floor(col % (256*256*256) / (256*256));
	}
	static draw_circle ([x ,y , r, outline]) {

		this.game.ctx.fillStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);
		this.game.ctx.strokeStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);

		this.game.ctx.beginPath();
		this.game.ctx.arc(x, y, r, 0, Math.PI*2);
		if (outline >= 1) {
			this.game.ctx.stroke();
		} else {
			this.game.ctx.fill();
		}
		this.game.ctx.closePath();

		return 0;
	}
	static draw_clear ([col]) {
		this.game.ctx.fillStyle = decimalColorToRGB(col);
		this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
		return 0;
	}
	static draw_get_alpha ([]) {
		return this.game.drawAlpha;
	}
	static draw_get_color ([]) {
		return this.game.drawColor;
	}
	static draw_line ([x1, y1, x2, y2]) {

		this.game.ctx.strokeStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);

		this.game.ctx.save();
		this.game.ctx.translate(0.5, 0.5)

		this.game.ctx.beginPath();
		this.game.ctx.moveTo(x1, y1);
		this.game.ctx.lineTo(x2, y2);
		this.game.ctx.closePath();
		this.game.ctx.stroke();

		this.game.ctx.restore();

		return 0;
	}
	static draw_point ([x, y]) {
		this.game.ctx.fillRect(x, y, 1, 1);
		return 0;
	}
	static draw_rectangle ([x1, y1, x2, y2, outline]) {

		this.game.ctx.fillStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);
		this.game.ctx.strokeStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);

		this.game.ctx.fillRect(x1, y1, x2-x1, y2-x2);
		if (outline >= 1) {
			this.game.ctx.stroke();
		} else {
			this.game.ctx.fill();
		}

		return 0;
	}
	static draw_set_alpha ([alpha]) {
		this.game.drawAlpha = alpha;
		return 0;
	}
	static draw_set_color ([color]) {
		this.game.drawColor = color;
		return 0;
	}
	static make_color_rgb ([red, green, blue]) {
		return red*256 + green*256*256 + blue*256*256*256;
	}

	// ## Fonts and text
	static draw_set_font ([font]) {
		this.game.drawFont = font;
		return 0;
	}
	static draw_set_halign ([halign]) {
		this.game.drawHAlign = halign;
		return 0;
	}
	static draw_set_valign ([valign]) {
		this.game.drawVAlign = valign;
		return 0;
	}
	static draw_text ([x, y, string]) {

		this.game.ctx.fillStyle = decimalColorAndAlphaToRGBA(this.game.drawColor, this.game.drawAlpha);

		var f = this.game.project.resources.ProjectFont.find(x => x.id == this.game.drawFont);
		if (f) {
			this.game.ctx.font = makeCSSFont(f.font, f.size, f.bold, f.italic);
		} else {
			this.game.ctx.font = makeCSSFont('Arial', 12, false, false);
		}

		// holy shit now this is epic
		this.game.ctx.textAlign = (['left', 'center', 'right'])[this.game.drawHAlign];
		this.game.ctx.textBaseline = (['top', 'middle', 'bottom'])[this.game.drawVAlign];

		this.game.ctx.fillText(string, x, y);
		return 0;
	}

	// ## Advanced drawing functions

	static draw_point_color ([x, y, col1]) {
		this.game.ctx.fillStyle = decimalColorToRGB(col1);
		this.game.ctx.fillRect(x, y, 1, 1);
		return 0;
	}
	static draw_set_blend_mode ([mode]) {
		// i dont know how blend modes work lol
		//this.game.drawBlendModeSrc
		return 0;
	}
	static draw_set_blend_mode_ext ([src, dest]) {
		this.game.drawBlendModeSrc = src;
		this.game.drawBlendModeDest = dest;
		return 0;
	}

	// # Splash screens, highscores, and other pop-ups

	// ## Pop-up messages and questions

	static get_integer ([str, def]) {
		var p = prompt(str, def);
		return parseInt(p, 10) !== NaN ? p : '';
	}
	static get_string ([str, def]) {
		var p = prompt(str, def);
		return p ? p : '';
	}
	static show_message ([message]) {
		alert(message);
		return 0;
	}

	// # Changing resources

	// ## Scripts

	static execute_string ([str]) {
		this.execute(this.prepare(str), this.currentInstance);
		return 0;
	}

	// # Action functions

	// ## move

	static action_move_to ([x, y]) {
		this.currentInstance.variables.x = x;
		this.currentInstance.variables.y = xy;
		return 0;
	}

	// ## main1
	// ## main2
	// ## control
	// ## score
	// ## extra
	// ## draw

	// # Unorganized

	/*
	static _ ([_]) {

		return 0;
	}
	*/

	static MCI_command ([_]) {

		return 0;
	}

	static action_another_room ([_]) {

		return 0;
	}
	static action_bounce ([_]) {

		return 0;
	}
	static action_cd_pause ([_]) {

		return 0;
	}
	static action_cd_play ([_]) {

		return 0;
	}
	static action_cd_playing ([_]) {

		return 0;
	}
	static action_cd_present ([_]) {

		return 0;
	}
	static action_cd_resume ([_]) {

		return 0;
	}
	static action_cd_stop ([_]) {

		return 0;
	}
	static action_change_object ([_]) {

		return 0;
	}
	static action_color ([_]) {

		return 0;
	}
	static action_create_object ([_]) {

		return 0;
	}
	static action_create_object_motion ([_]) {

		return 0;
	}
	static action_create_object_random ([_]) {

		return 0;
	}
	static action_current_room ([_]) {

		return 0;
	}
	static action_draw_arrow ([_]) {

		return 0;
	}
	static action_draw_background ([_]) {

		return 0;
	}
	static action_draw_ellipse ([_]) {

		return 0;
	}
	static action_draw_ellipse_gradient ([_]) {

		return 0;
	}
	static action_draw_gradient_hor ([_]) {

		return 0;
	}
	static action_draw_gradient_vert ([_]) {

		return 0;
	}
	static action_draw_health ([_]) {

		return 0;
	}
	static action_draw_life ([_]) {

		return 0;
	}
	static action_draw_life_images ([_]) {

		return 0;
	}
	static action_draw_line ([_]) {

		return 0;
	}
	static action_draw_rectangle ([_]) {

		return 0;
	}
	static action_draw_score ([_]) {

		return 0;
	}
	static action_draw_sprite ([_]) {

		return 0;
	}
	static action_draw_text ([_]) {

		return 0;
	}
	static action_draw_text_transformed ([_]) {

		return 0;
	}
	static action_draw_variable ([_]) {

		return 0;
	}
	static action_effect ([_]) {

		return 0;
	}
	static action_end_game ([_]) {

		return 0;
	}
	static action_end_sound ([_]) {

		return 0;
	}
	static action_execute_script ([_]) {

		return 0;
	}
	static action_font ([_]) {

		return 0;
	}
	static action_fullscreen ([_]) {

		return 0;
	}
	static action_highscore_clear ([_]) {

		return 0;
	}
	static action_highscore_show ([_]) {

		return 0;
	}
	static action_if ([_]) {

		return 0;
	}
	static action_if_aligned ([_]) {

		return 0;
	}
	static action_if_collision ([_]) {

		return 0;
	}
	static action_if_dice ([_]) {

		return 0;
	}
	static action_if_empty ([_]) {

		return 0;
	}
	static action_if_health ([_]) {

		return 0;
	}
	static action_if_life ([_]) {

		return 0;
	}
	static action_if_mouse ([_]) {

		return 0;
	}
	static action_if_next_room ([_]) {

		return 0;
	}
	static action_if_number ([_]) {

		return 0;
	}
	static action_if_object ([_]) {

		return 0;
	}
	static action_if_previous_room ([_]) {

		return 0;
	}
	static action_if_question ([_]) {

		return 0;
	}
	static action_if_score ([_]) {

		return 0;
	}
	static action_if_sound ([_]) {

		return 0;
	}
	static action_if_variable ([_]) {

		return 0;
	}
	static action_inherited ([_]) {

		return 0;
	}
	static action_kill_object ([_]) {

		return 0;
	}
	static action_kill_position ([_]) {

		return 0;
	}
	static action_linear_step ([_]) {

		return 0;
	}
	static action_load_game ([_]) {

		return 0;
	}
	static action_message ([_]) {

		return 0;
	}
	static action_move ([_]) {

		return 0;
	}
	static action_move_contact ([_]) {

		return 0;
	}
	static action_move_point ([_]) {

		return 0;
	}
	static action_move_random ([_]) {

		return 0;
	}
	static action_move_start ([_]) {

		return 0;
	}
	static action_next_room ([_]) {

		return 0;
	}
	static action_partemit_burst ([_]) {

		return 0;
	}
	static action_partemit_create ([_]) {

		return 0;
	}
	static action_partemit_destroy ([_]) {

		return 0;
	}
	static action_partemit_stream ([_]) {

		return 0;
	}
	static action_partsyst_clear ([_]) {

		return 0;
	}
	static action_partsyst_create ([_]) {

		return 0;
	}
	static action_partsyst_destroy ([_]) {

		return 0;
	}
	static action_parttype_color ([_]) {

		return 0;
	}
	static action_parttype_create ([_]) {

		return 0;
	}
	static action_parttype_gravity ([_]) {

		return 0;
	}
	static action_parttype_life ([_]) {

		return 0;
	}
	static action_parttype_secondary ([_]) {

		return 0;
	}
	static action_parttype_speed ([_]) {

		return 0;
	}
	static action_path ([_]) {

		return 0;
	}
	static action_path_end ([_]) {

		return 0;
	}
	static action_path_position ([_]) {

		return 0;
	}
	static action_path_speed ([_]) {

		return 0;
	}
	static action_potential_step ([_]) {

		return 0;
	}
	static action_previous_room ([_]) {

		return 0;
	}
	static action_replace_background ([_]) {

		return 0;
	}
	static action_replace_sound ([_]) {

		return 0;
	}
	static action_replace_sprite ([_]) {

		return 0;
	}
	static action_restart_game ([_]) {

		return 0;
	}
	static action_reverse_xdir ([_]) {

		return 0;
	}
	static action_reverse_ydir ([_]) {

		return 0;
	}
	static action_save_game ([_]) {

		return 0;
	}
	static action_set_alarm ([_]) {

		return 0;
	}
	static action_set_caption ([_]) {

		return 0;
	}
	static action_set_cursor ([_]) {

		return 0;
	}
	static action_set_friction ([_]) {

		return 0;
	}
	static action_set_gravity ([_]) {

		return 0;
	}
	static action_set_health ([_]) {

		return 0;
	}
	static action_set_hspeed ([_]) {

		return 0;
	}
	static action_set_life ([_]) {

		return 0;
	}
	static action_set_motion ([_]) {

		return 0;
	}
	static action_set_score ([_]) {

		return 0;
	}
	static action_set_timeline ([_]) {

		return 0;
	}
	static action_set_timeline_position ([_]) {

		return 0;
	}
	static action_set_timeline_speed ([_]) {

		return 0;
	}
	static action_set_vspeed ([_]) {

		return 0;
	}
	static action_show_info ([_]) {

		return 0;
	}
	static action_show_video ([_]) {

		return 0;
	}
	static action_sleep ([_]) {

		return 0;
	}
	static action_snap ([_]) {

		return 0;
	}
	static action_snapshot ([_]) {

		return 0;
	}
	static action_sound ([_]) {

		return 0;
	}
	static action_splash_image ([_]) {

		return 0;
	}
	static action_splash_settings ([_]) {

		return 0;
	}
	static action_splash_text ([_]) {

		return 0;
	}
	static action_splash_video ([_]) {

		return 0;
	}
	static action_splash_web ([_]) {

		return 0;
	}
	static action_sprite_color ([_]) {

		return 0;
	}
	static action_sprite_set ([_]) {

		return 0;
	}
	static action_sprite_transform ([_]) {

		return 0;
	}
	static action_timeline_pause ([_]) {

		return 0;
	}
	static action_timeline_set ([_]) {

		return 0;
	}
	static action_timeline_start ([_]) {

		return 0;
	}
	static action_timeline_stop ([_]) {

		return 0;
	}
	static action_webpage ([_]) {

		return 0;
	}
	static action_wrap ([_]) {

		return 0;
	}
	
	static background_add ([_]) {

		return 0;
	}
	static background_add_background ([_]) {

		return 0;
	}
	static background_assign ([_]) {

		return 0;
	}
	static background_create_color ([_]) {

		return 0;
	}
	static background_create_from_screen ([_]) {

		return 0;
	}
	static background_create_from_surface ([_]) {

		return 0;
	}
	static background_create_gradient ([_]) {

		return 0;
	}
	static background_delete ([_]) {

		return 0;
	}
	static background_duplicate ([_]) {

		return 0;
	}
	static background_exists ([_]) {

		return 0;
	}
	static background_get_height ([_]) {

		return 0;
	}
	static background_get_name ([_]) {

		return 0;
	}
	static background_get_texture ([_]) {

		return 0;
	}
	static background_get_width ([_]) {

		return 0;
	}
	static background_name ([_]) {

		return 0;
	}
	static background_replace ([_]) {

		return 0;
	}
	static background_replace_background ([_]) {

		return 0;
	}
	static background_save ([_]) {

		return 0;
	}
	static background_set_alpha_from_background ([_]) {

		return 0;
	}
	static cd_close_door ([_]) {

		return 0;
	}
	static cd_init ([_]) {

		return 0;
	}
	static cd_length ([_]) {

		return 0;
	}
	static cd_number ([_]) {

		return 0;
	}
	static cd_open_door ([_]) {

		return 0;
	}
	static cd_pause ([_]) {

		return 0;
	}
	static cd_paused ([_]) {

		return 0;
	}
	static cd_play ([_]) {

		return 0;
	}
	static cd_playing ([_]) {

		return 0;
	}
	static cd_position ([_]) {

		return 0;
	}
	static cd_present ([_]) {

		return 0;
	}
	static cd_resume ([_]) {

		return 0;
	}
	static cd_set_position ([_]) {

		return 0;
	}
	static cd_set_track_position ([_]) {

		return 0;
	}
	static cd_stop ([_]) {

		return 0;
	}
	static cd_track ([_]) {

		return 0;
	}
	static cd_track_length ([_]) {

		return 0;
	}
	static cd_track_position ([_]) {

		return 0;
	}
	static clipboard_get_text ([_]) {

		return 0;
	}
	static clipboard_has_text ([_]) {

		return 0;
	}
	static clipboard_set_text ([_]) {

		return 0;
	}
	static collision_circle ([_]) {

		return 0;
	}
	static collision_ellipse ([_]) {

		return 0;
	}
	static collision_line ([_]) {

		return 0;
	}
	static collision_point ([_]) {

		return 0;
	}
	static collision_rectangle ([_]) {

		return 0;
	}
	static color_get_hue ([_]) {

		return 0;
	}
	static color_get_saturation ([_]) {

		return 0;
	}
	static color_get_value ([_]) {

		return 0;
	}
	static d3d_draw_block ([_]) {

		return 0;
	}
	static d3d_draw_cone ([_]) {

		return 0;
	}
	static d3d_draw_cylinder ([_]) {

		return 0;
	}
	static d3d_draw_ellipsoid ([_]) {

		return 0;
	}
	static d3d_draw_floor ([_]) {

		return 0;
	}
	static d3d_draw_wall ([_]) {

		return 0;
	}
	static d3d_end ([_]) {

		return 0;
	}
	static d3d_light_define_direction ([_]) {

		return 0;
	}
	static d3d_light_define_point ([_]) {

		return 0;
	}
	static d3d_light_enable ([_]) {

		return 0;
	}
	static d3d_model_block ([_]) {

		return 0;
	}
	static d3d_model_clear ([_]) {

		return 0;
	}
	static d3d_model_cone ([_]) {

		return 0;
	}
	static d3d_model_create ([_]) {

		return 0;
	}
	static d3d_model_cylinder ([_]) {

		return 0;
	}
	static d3d_model_destroy ([_]) {

		return 0;
	}
	static d3d_model_draw ([_]) {

		return 0;
	}
	static d3d_model_ellipsoid ([_]) {

		return 0;
	}
	static d3d_model_floor ([_]) {

		return 0;
	}
	static d3d_model_load ([_]) {

		return 0;
	}
	static d3d_model_primitive_begin ([_]) {

		return 0;
	}
	static d3d_model_primitive_end ([_]) {

		return 0;
	}
	static d3d_model_save ([_]) {

		return 0;
	}
	static d3d_model_vertex ([_]) {

		return 0;
	}
	static d3d_model_vertex_color ([_]) {

		return 0;
	}
	static d3d_model_vertex_normal ([_]) {

		return 0;
	}
	static d3d_model_vertex_normal_color ([_]) {

		return 0;
	}
	static d3d_model_vertex_normal_texture ([_]) {

		return 0;
	}
	static d3d_model_vertex_normal_texture_color ([_]) {

		return 0;
	}
	static d3d_model_vertex_texture ([_]) {

		return 0;
	}
	static d3d_model_vertex_texture_color ([_]) {

		return 0;
	}
	static d3d_model_wall ([_]) {

		return 0;
	}
	static d3d_primitive_begin ([_]) {

		return 0;
	}
	static d3d_primitive_begin_texture ([_]) {

		return 0;
	}
	static d3d_primitive_end ([_]) {

		return 0;
	}
	static d3d_set_culling ([_]) {

		return 0;
	}
	static d3d_set_depth ([_]) {

		return 0;
	}
	static d3d_set_fog ([_]) {

		return 0;
	}
	static d3d_set_hidden ([_]) {

		return 0;
	}
	static d3d_set_lighting ([_]) {

		return 0;
	}
	static d3d_set_perspective ([_]) {

		return 0;
	}
	static d3d_set_projection ([_]) {

		return 0;
	}
	static d3d_set_projection_ext ([_]) {

		return 0;
	}
	static d3d_set_projection_ortho ([_]) {

		return 0;
	}
	static d3d_set_projection_perspective ([_]) {

		return 0;
	}
	static d3d_set_shading ([_]) {

		return 0;
	}
	static d3d_start ([_]) {

		return 0;
	}
	static d3d_transform_add_rotation_axis ([_]) {

		return 0;
	}
	static d3d_transform_add_rotation_x ([_]) {

		return 0;
	}
	static d3d_transform_add_rotation_y ([_]) {

		return 0;
	}
	static d3d_transform_add_rotation_z ([_]) {

		return 0;
	}
	static d3d_transform_add_scaling ([_]) {

		return 0;
	}
	static d3d_transform_add_translation ([_]) {

		return 0;
	}
	static d3d_transform_set_identity ([_]) {

		return 0;
	}
	static d3d_transform_set_rotation_axis ([_]) {

		return 0;
	}
	static d3d_transform_set_rotation_x ([_]) {

		return 0;
	}
	static d3d_transform_set_rotation_y ([_]) {

		return 0;
	}
	static d3d_transform_set_rotation_z ([_]) {

		return 0;
	}
	static d3d_transform_set_scaling ([_]) {

		return 0;
	}
	static d3d_transform_set_translation ([_]) {

		return 0;
	}
	static d3d_transform_stack_clear ([_]) {

		return 0;
	}
	static d3d_transform_stack_discard ([_]) {

		return 0;
	}
	static d3d_transform_stack_empty ([_]) {

		return 0;
	}
	static d3d_transform_stack_pop ([_]) {

		return 0;
	}
	static d3d_transform_stack_push ([_]) {

		return 0;
	}
	static d3d_transform_stack_top ([_]) {

		return 0;
	}
	static d3d_vertex ([_]) {

		return 0;
	}
	static d3d_vertex_color ([_]) {

		return 0;
	}
	static d3d_vertex_normal ([_]) {

		return 0;
	}
	static d3d_vertex_normal_color ([_]) {

		return 0;
	}
	static d3d_vertex_normal_texture ([_]) {

		return 0;
	}
	static d3d_vertex_normal_texture_color ([_]) {

		return 0;
	}
	static d3d_vertex_texture ([_]) {

		return 0;
	}
	static d3d_vertex_texture_color ([_]) {

		return 0;
	}
	static date_compare_date ([_]) {

		return 0;
	}
	static date_compare_datetime ([_]) {

		return 0;
	}
	static date_compare_time ([_]) {

		return 0;
	}
	static date_create_date ([_]) {

		return 0;
	}
	static date_create_datetime ([_]) {

		return 0;
	}
	static date_create_time ([_]) {

		return 0;
	}
	static date_current_date ([_]) {

		return 0;
	}
	static date_current_datetime ([_]) {

		return 0;
	}
	static date_current_time ([_]) {

		return 0;
	}
	static date_date_of ([_]) {

		return 0;
	}
	static date_date_string ([_]) {

		return 0;
	}
	static date_datetime_string ([_]) {

		return 0;
	}
	static date_day_span ([_]) {

		return 0;
	}
	static date_days_in_month ([_]) {

		return 0;
	}
	static date_days_in_year ([_]) {

		return 0;
	}
	static date_get_day ([_]) {

		return 0;
	}
	static date_get_day_of_year ([_]) {

		return 0;
	}
	static date_get_hour ([_]) {

		return 0;
	}
	static date_get_hour_of_year ([_]) {

		return 0;
	}
	static date_get_minute ([_]) {

		return 0;
	}
	static date_get_minute_of_year ([_]) {

		return 0;
	}
	static date_get_month ([_]) {

		return 0;
	}
	static date_get_second ([_]) {

		return 0;
	}
	static date_get_second_of_year ([_]) {

		return 0;
	}
	static date_get_week ([_]) {

		return 0;
	}
	static date_get_weekday ([_]) {

		return 0;
	}
	static date_get_year ([_]) {

		return 0;
	}
	static date_hour_span ([_]) {

		return 0;
	}
	static date_inc_day ([_]) {

		return 0;
	}
	static date_inc_hour ([_]) {

		return 0;
	}
	static date_inc_minute ([_]) {

		return 0;
	}
	static date_inc_month ([_]) {

		return 0;
	}
	static date_inc_second ([_]) {

		return 0;
	}
	static date_inc_week ([_]) {

		return 0;
	}
	static date_inc_year ([_]) {

		return 0;
	}
	static date_is_today ([_]) {

		return 0;
	}
	static date_leap_year ([_]) {

		return 0;
	}
	static date_minute_span ([_]) {

		return 0;
	}
	static date_month_span ([_]) {

		return 0;
	}
	static date_second_span ([_]) {

		return 0;
	}
	static date_time_of ([_]) {

		return 0;
	}
	static date_time_string ([_]) {

		return 0;
	}
	static date_valid_date ([_]) {

		return 0;
	}
	static date_valid_datetime ([_]) {

		return 0;
	}
	static date_valid_time ([_]) {

		return 0;
	}
	static date_week_span ([_]) {

		return 0;
	}
	static date_year_span ([_]) {

		return 0;
	}
	static directory_create ([_]) {

		return 0;
	}
	static directory_exists ([_]) {

		return 0;
	}
	static discard_include_file ([_]) {

		return 0;
	}
	static disk_free ([_]) {

		return 0;
	}
	static disk_size ([_]) {

		return 0;
	}
	static display_get_colordepth ([_]) {

		return 0;
	}
	static display_get_frequency ([_]) {

		return 0;
	}
	static display_get_height ([_]) {

		return 0;
	}
	static display_get_width ([_]) {

		return 0;
	}
	static display_mouse_get_x ([_]) {

		return 0;
	}
	static display_mouse_get_y ([_]) {

		return 0;
	}
	static display_mouse_set ([_]) {

		return 0;
	}
	static display_reset ([_]) {

		return 0;
	}
	static display_set_all ([_]) {

		return 0;
	}
	static display_set_colordepth ([_]) {

		return 0;
	}
	static display_set_frequency ([_]) {

		return 0;
	}
	static display_set_size ([_]) {

		return 0;
	}
	static display_test_all ([_]) {

		return 0;
	}
	static distance_to_object ([_]) {

		return 0;
	}
	static distance_to_point ([_]) {

		return 0;
	}
	static draw_arrow ([_]) {

		return 0;
	}
	static draw_background ([_]) {

		return 0;
	}
	static draw_background_ext ([_]) {

		return 0;
	}
	static draw_background_general ([_]) {

		return 0;
	}
	static draw_background_part ([_]) {

		return 0;
	}
	static draw_background_part_ext ([_]) {

		return 0;
	}
	static draw_background_stretched ([_]) {

		return 0;
	}
	static draw_background_stretched_ext ([_]) {

		return 0;
	}
	static draw_background_tiled ([_]) {

		return 0;
	}
	static draw_background_tiled_ext ([_]) {

		return 0;
	}
	static draw_button ([_]) {

		return 0;
	}
	static draw_circle_color ([_]) {

		return 0;
	}
	static draw_clear_alpha ([_]) {

		return 0;
	}
	static draw_ellipse ([_]) {

		return 0;
	}
	static draw_ellipse_color ([_]) {

		return 0;
	}
	static draw_getpixel ([_]) {

		return 0;
	}
	static draw_healthbar ([_]) {

		return 0;
	}
	static draw_highscore ([_]) {

		return 0;
	}
	static draw_line_color ([_]) {

		return 0;
	}
	static draw_line_width ([_]) {

		return 0;
	}
	static draw_line_width_color ([_]) {

		return 0;
	}
	static draw_path ([_]) {

		return 0;
	}
	static draw_primitive_begin ([_]) {

		return 0;
	}
	static draw_primitive_begin_texture ([_]) {

		return 0;
	}
	static draw_primitive_end ([_]) {

		return 0;
	}
	static draw_rectangle_color ([_]) {

		return 0;
	}
	static draw_roundrect ([_]) {

		return 0;
	}
	static draw_roundrect_color ([_]) {

		return 0;
	}	
	static draw_set_circle_precision ([_]) {

		return 0;
	}
	
	static draw_sprite_ext ([_]) {

		return 0;
	}
	static draw_sprite_general ([_]) {

		return 0;
	}
	static draw_sprite_part ([_]) {

		return 0;
	}
	static draw_sprite_part_ext ([_]) {

		return 0;
	}
	static draw_sprite_stretched ([_]) {

		return 0;
	}
	static draw_sprite_stretched_ext ([_]) {

		return 0;
	}
	static draw_sprite_tiled ([_]) {

		return 0;
	}
	static draw_sprite_tiled_ext ([_]) {

		return 0;
	}
	static draw_surface ([_]) {

		return 0;
	}
	static draw_surface_ext ([_]) {

		return 0;
	}
	static draw_surface_general ([_]) {

		return 0;
	}
	static draw_surface_part ([_]) {

		return 0;
	}
	static draw_surface_part_ext ([_]) {

		return 0;
	}
	static draw_surface_stretched ([_]) {

		return 0;
	}
	static draw_surface_stretched_ext ([_]) {

		return 0;
	}
	static draw_surface_tiled ([_]) {

		return 0;
	}
	static draw_surface_tiled_ext ([_]) {

		return 0;
	}
	static draw_text_color ([_]) {

		return 0;
	}
	static draw_text_ext ([_]) {

		return 0;
	}
	static draw_text_ext_color ([_]) {

		return 0;
	}
	static draw_text_ext_transformed ([_]) {

		return 0;
	}
	static draw_text_ext_transformed_color ([_]) {

		return 0;
	}
	static draw_text_transformed ([_]) {

		return 0;
	}
	static draw_text_transformed_color ([_]) {

		return 0;
	}
	static draw_triangle ([_]) {

		return 0;
	}
	static draw_triangle_color ([_]) {

		return 0;
	}
	static draw_vertex ([_]) {

		return 0;
	}
	static draw_vertex_color ([_]) {

		return 0;
	}
	static draw_vertex_texture ([_]) {

		return 0;
	}
	static draw_vertex_texture_color ([_]) {

		return 0;
	}
	static ds_grid_add ([_]) {

		return 0;
	}
	static ds_grid_add_disk ([_]) {

		return 0;
	}
	static ds_grid_add_grid_region ([_]) {

		return 0;
	}
	static ds_grid_add_region ([_]) {

		return 0;
	}
	static ds_grid_clear ([_]) {

		return 0;
	}
	static ds_grid_copy ([_]) {

		return 0;
	}
	static ds_grid_create ([_]) {

		return 0;
	}
	static ds_grid_destroy ([_]) {

		return 0;
	}
	static ds_grid_get ([_]) {

		return 0;
	}
	static ds_grid_get_disk_max ([_]) {

		return 0;
	}
	static ds_grid_get_disk_mean ([_]) {

		return 0;
	}
	static ds_grid_get_disk_min ([_]) {

		return 0;
	}
	static ds_grid_get_disk_sum ([_]) {

		return 0;
	}
	static ds_grid_get_max ([_]) {

		return 0;
	}
	static ds_grid_get_mean ([_]) {

		return 0;
	}
	static ds_grid_get_min ([_]) {

		return 0;
	}
	static ds_grid_get_sum ([_]) {

		return 0;
	}
	static ds_grid_height ([_]) {

		return 0;
	}
	static ds_grid_multiply ([_]) {

		return 0;
	}
	static ds_grid_multiply_disk ([_]) {

		return 0;
	}
	static ds_grid_multiply_grid_region ([_]) {

		return 0;
	}
	static ds_grid_multiply_region ([_]) {

		return 0;
	}
	static ds_grid_read ([_]) {

		return 0;
	}
	static ds_grid_resize ([_]) {

		return 0;
	}
	static ds_grid_set ([_]) {

		return 0;
	}
	static ds_grid_set_disk ([_]) {

		return 0;
	}
	static ds_grid_set_grid_region ([_]) {

		return 0;
	}
	static ds_grid_set_region ([_]) {

		return 0;
	}
	static ds_grid_shuffle ([_]) {

		return 0;
	}
	static ds_grid_value_disk_exists ([_]) {

		return 0;
	}
	static ds_grid_value_disk_x ([_]) {

		return 0;
	}
	static ds_grid_value_disk_y ([_]) {

		return 0;
	}
	static ds_grid_value_exists ([_]) {

		return 0;
	}
	static ds_grid_value_x ([_]) {

		return 0;
	}
	static ds_grid_value_y ([_]) {

		return 0;
	}
	static ds_grid_width ([_]) {

		return 0;
	}
	static ds_grid_write ([_]) {

		return 0;
	}
	static ds_list_add ([_]) {

		return 0;
	}
	static ds_list_clear ([_]) {

		return 0;
	}
	static ds_list_copy ([_]) {

		return 0;
	}
	static ds_list_create ([_]) {

		return 0;
	}
	static ds_list_delete ([_]) {

		return 0;
	}
	static ds_list_destroy ([_]) {

		return 0;
	}
	static ds_list_empty ([_]) {

		return 0;
	}
	static ds_list_find_index ([_]) {

		return 0;
	}
	static ds_list_find_value ([_]) {

		return 0;
	}
	static ds_list_insert ([_]) {

		return 0;
	}
	static ds_list_read ([_]) {

		return 0;
	}
	static ds_list_replace ([_]) {

		return 0;
	}
	static ds_list_shuffle ([_]) {

		return 0;
	}
	static ds_list_size ([_]) {

		return 0;
	}
	static ds_list_sort ([_]) {

		return 0;
	}
	static ds_list_write ([_]) {

		return 0;
	}
	static ds_map_add ([_]) {

		return 0;
	}
	static ds_map_clear ([_]) {

		return 0;
	}
	static ds_map_copy ([_]) {

		return 0;
	}
	static ds_map_create ([_]) {

		return 0;
	}
	static ds_map_delete ([_]) {

		return 0;
	}
	static ds_map_destroy ([_]) {

		return 0;
	}
	static ds_map_empty ([_]) {

		return 0;
	}
	static ds_map_exists ([_]) {

		return 0;
	}
	static ds_map_find_first ([_]) {

		return 0;
	}
	static ds_map_find_last ([_]) {

		return 0;
	}
	static ds_map_find_next ([_]) {

		return 0;
	}
	static ds_map_find_previous ([_]) {

		return 0;
	}
	static ds_map_find_value ([_]) {

		return 0;
	}
	static ds_map_read ([_]) {

		return 0;
	}
	static ds_map_replace ([_]) {

		return 0;
	}
	static ds_map_size ([_]) {

		return 0;
	}
	static ds_map_write ([_]) {

		return 0;
	}
	static ds_priority_add ([_]) {

		return 0;
	}
	static ds_priority_change_priority ([_]) {

		return 0;
	}
	static ds_priority_clear ([_]) {

		return 0;
	}
	static ds_priority_copy ([_]) {

		return 0;
	}
	static ds_priority_create ([_]) {

		return 0;
	}
	static ds_priority_delete_max ([_]) {

		return 0;
	}
	static ds_priority_delete_min ([_]) {

		return 0;
	}
	static ds_priority_delete_value ([_]) {

		return 0;
	}
	static ds_priority_destroy ([_]) {

		return 0;
	}
	static ds_priority_empty ([_]) {

		return 0;
	}
	static ds_priority_find_max ([_]) {

		return 0;
	}
	static ds_priority_find_min ([_]) {

		return 0;
	}
	static ds_priority_find_priority ([_]) {

		return 0;
	}
	static ds_priority_read ([_]) {

		return 0;
	}
	static ds_priority_size ([_]) {

		return 0;
	}
	static ds_priority_write ([_]) {

		return 0;
	}
	static ds_queue_clear ([_]) {

		return 0;
	}
	static ds_queue_copy ([_]) {

		return 0;
	}
	static ds_queue_create ([_]) {

		return 0;
	}
	static ds_queue_dequeue ([_]) {

		return 0;
	}
	static ds_queue_destroy ([_]) {

		return 0;
	}
	static ds_queue_empty ([_]) {

		return 0;
	}
	static ds_queue_enqueue ([_]) {

		return 0;
	}
	static ds_queue_head ([_]) {

		return 0;
	}
	static ds_queue_read ([_]) {

		return 0;
	}
	static ds_queue_size ([_]) {

		return 0;
	}
	static ds_queue_tail ([_]) {

		return 0;
	}
	static ds_queue_write ([_]) {

		return 0;
	}
	static ds_set_precision ([_]) {

		return 0;
	}
	static ds_stack_clear ([_]) {

		return 0;
	}
	static ds_stack_copy ([_]) {

		return 0;
	}
	static ds_stack_create ([_]) {

		return 0;
	}
	static ds_stack_destroy ([_]) {

		return 0;
	}
	static ds_stack_empty ([_]) {

		return 0;
	}
	static ds_stack_pop ([_]) {

		return 0;
	}
	static ds_stack_push ([_]) {

		return 0;
	}
	static ds_stack_read ([_]) {

		return 0;
	}
	static ds_stack_size ([_]) {

		return 0;
	}
	static ds_stack_top ([_]) {

		return 0;
	}
	static ds_stack_write ([_]) {

		return 0;
	}
	static effect_clear ([_]) {

		return 0;
	}
	static effect_create_above ([_]) {

		return 0;
	}
	static effect_create_below ([_]) {

		return 0;
	}
	static environment_get_variable ([_]) {

		return 0;
	}
	static event_inherited ([_]) {

		return 0;
	}
	static event_perform ([_]) {

		return 0;
	}
	static event_perform_object ([_]) {

		return 0;
	}
	static event_user ([_]) {

		return 0;
	}
	static execute_file ([_]) {

		return 0;
	}
	static execute_program ([_]) {

		return 0;
	}
	static execute_shell ([_]) {

		return 0;
	}
	static export_include_file ([_]) {

		return 0;
	}
	static export_include_file_location ([_]) {

		return 0;
	}
	static external_call ([_]) {

		return 0;
	}
	static external_call0 ([_]) {

		return 0;
	}
	static external_call1 ([_]) {

		return 0;
	}
	static external_call2 ([_]) {

		return 0;
	}
	static external_call3 ([_]) {

		return 0;
	}
	static external_call4 ([_]) {

		return 0;
	}
	static external_call5 ([_]) {

		return 0;
	}
	static external_call6 ([_]) {

		return 0;
	}
	static external_call7 ([_]) {

		return 0;
	}
	static external_call8 ([_]) {

		return 0;
	}
	static external_define ([_]) {

		return 0;
	}
	static external_define0 ([_]) {

		return 0;
	}
	static external_define1 ([_]) {

		return 0;
	}
	static external_define2 ([_]) {

		return 0;
	}
	static external_define3 ([_]) {

		return 0;
	}
	static external_define4 ([_]) {

		return 0;
	}
	static external_define5 ([_]) {

		return 0;
	}
	static external_define6 ([_]) {

		return 0;
	}
	static external_define7 ([_]) {

		return 0;
	}
	static external_define8 ([_]) {

		return 0;
	}
	static external_free ([_]) {

		return 0;
	}
	static file_attributes ([_]) {

		return 0;
	}
	static file_bin_close ([_]) {

		return 0;
	}
	static file_bin_open ([_]) {

		return 0;
	}
	static file_bin_position ([_]) {

		return 0;
	}
	static file_bin_read_byte ([_]) {

		return 0;
	}
	static file_bin_rewrite ([_]) {

		return 0;
	}
	static file_bin_seek ([_]) {

		return 0;
	}
	static file_bin_size ([_]) {

		return 0;
	}
	static file_bin_write_byte ([_]) {

		return 0;
	}
	static file_close ([_]) {

		return 0;
	}
	static file_copy ([_]) {

		return 0;
	}
	static file_delete ([_]) {

		return 0;
	}
	static file_eof ([_]) {

		return 0;
	}
	static file_eoln ([_]) {

		return 0;
	}
	static file_exists ([_]) {

		return 0;
	}
	static file_find_close ([_]) {

		return 0;
	}
	static file_find_first ([_]) {

		return 0;
	}
	static file_find_next ([_]) {

		return 0;
	}
	static file_open_append ([_]) {

		return 0;
	}
	static file_open_read ([_]) {

		return 0;
	}
	static file_open_write ([_]) {

		return 0;
	}
	static file_read_real ([_]) {

		return 0;
	}
	static file_read_string ([_]) {

		return 0;
	}
	static file_readln ([_]) {

		return 0;
	}
	static file_rename ([_]) {

		return 0;
	}
	static file_text_close ([_]) {

		return 0;
	}
	static file_text_eof ([_]) {

		return 0;
	}
	static file_text_eoln ([_]) {

		return 0;
	}
	static file_text_open_append ([_]) {

		return 0;
	}
	static file_text_open_read ([_]) {

		return 0;
	}
	static file_text_open_write ([_]) {

		return 0;
	}
	static file_text_read_real ([_]) {

		return 0;
	}
	static file_text_read_string ([_]) {

		return 0;
	}
	static file_text_readln ([_]) {

		return 0;
	}
	static file_text_write_real ([_]) {

		return 0;
	}
	static file_text_write_string ([_]) {

		return 0;
	}
	static file_text_writeln ([_]) {

		return 0;
	}
	static file_write_real ([_]) {

		return 0;
	}
	static file_write_string ([_]) {

		return 0;
	}
	static file_writeln ([_]) {

		return 0;
	}
	static filename_change_ext ([_]) {

		return 0;
	}
	static filename_dir ([_]) {

		return 0;
	}
	static filename_drive ([_]) {

		return 0;
	}
	static filename_ext ([_]) {

		return 0;
	}
	static filename_name ([_]) {

		return 0;
	}
	static filename_path ([_]) {

		return 0;
	}
	
	static font_add ([_]) {

		return 0;
	}
	static font_add_sprite ([_]) {

		return 0;
	}
	static font_delete ([_]) {

		return 0;
	}
	static font_exists ([_]) {

		return 0;
	}
	static font_get_bold ([_]) {

		return 0;
	}
	static font_get_first ([_]) {

		return 0;
	}
	static font_get_fontname ([_]) {

		return 0;
	}
	static font_get_italic ([_]) {

		return 0;
	}
	static font_get_last ([_]) {

		return 0;
	}
	static font_get_name ([_]) {

		return 0;
	}
	static font_get_size ([_]) {

		return 0;
	}
	static font_name ([_]) {

		return 0;
	}
	static font_replace ([_]) {

		return 0;
	}
	static font_replace_sprite ([_]) {

		return 0;
	}

	static game_load ([_]) {

		return 0;
	}
	static game_restart ([_]) {

		return 0;
	}
	static game_save ([_]) {

		return 0;
	}
	static get_color ([_]) {

		return 0;
	}
	static get_directory ([_]) {

		return 0;
	}
	static get_directory_alt ([_]) {

		return 0;
	}
	
	static get_open_filename ([_]) {

		return 0;
	}
	static get_save_filename ([_]) {

		return 0;
	}
	
	static highscore_add ([_]) {

		return 0;
	}
	static highscore_add_current ([_]) {

		return 0;
	}
	static highscore_clear ([_]) {

		return 0;
	}
	static highscore_name ([_]) {

		return 0;
	}
	static highscore_set_background ([_]) {

		return 0;
	}
	static highscore_set_border ([_]) {

		return 0;
	}
	static highscore_set_colors ([_]) {

		return 0;
	}
	static highscore_set_font ([_]) {

		return 0;
	}
	static highscore_set_strings ([_]) {

		return 0;
	}
	static highscore_show ([_]) {

		return 0;
	}
	static highscore_show_ext ([_]) {

		return 0;
	}
	static highscore_value ([_]) {

		return 0;
	}
	static ini_close ([_]) {

		return 0;
	}
	static ini_key_delete ([_]) {

		return 0;
	}
	static ini_key_exists ([_]) {

		return 0;
	}
	static ini_open ([_]) {

		return 0;
	}
	static ini_read_real ([_]) {

		return 0;
	}
	static ini_read_string ([_]) {

		return 0;
	}
	static ini_section_delete ([_]) {

		return 0;
	}
	static ini_section_exists ([_]) {

		return 0;
	}
	static ini_write_real ([_]) {

		return 0;
	}
	static ini_write_string ([_]) {

		return 0;
	}
	static instance_activate_all ([_]) {

		return 0;
	}
	static instance_activate_object ([_]) {

		return 0;
	}
	static instance_activate_region ([_]) {

		return 0;
	}
	static instance_change ([_]) {

		return 0;
	}
	static instance_copy ([_]) {

		return 0;
	}
	static instance_deactivate_all ([_]) {

		return 0;
	}
	static instance_deactivate_object ([_]) {

		return 0;
	}
	static instance_deactivate_region ([_]) {

		return 0;
	}
	static instance_find ([_]) {

		return 0;
	}
	static instance_furthest ([_]) {

		return 0;
	}
	static instance_nearest ([_]) {

		return 0;
	}
	static instance_number ([_]) {

		return 0;
	}
	static instance_place ([_]) {

		return 0;
	}
	static instance_position ([_]) {

		return 0;
	}
	static instance_sprite ([_]) {

		return 0;
	}
	static io_clear ([_]) {

		return 0;
	}
	static io_handle ([_]) {

		return 0;
	}
	static joystick_axes ([_]) {

		return 0;
	}
	static joystick_buttons ([_]) {

		return 0;
	}
	static joystick_check_button ([_]) {

		return 0;
	}
	static joystick_direction ([_]) {

		return 0;
	}
	static joystick_exists ([_]) {

		return 0;
	}
	static joystick_has_pov ([_]) {

		return 0;
	}
	static joystick_name ([_]) {

		return 0;
	}
	static joystick_pov ([_]) {

		return 0;
	}
	static joystick_rpos ([_]) {

		return 0;
	}
	static joystick_upos ([_]) {

		return 0;
	}
	static joystick_vpos ([_]) {

		return 0;
	}
	static joystick_xpos ([_]) {

		return 0;
	}
	static joystick_ypos ([_]) {

		return 0;
	}
	static joystick_zpos ([_]) {

		return 0;
	}
	static keyboard_check_direct ([_]) {

		return 0;
	}
	static keyboard_clear ([_]) {

		return 0;
	}
	static keyboard_get_map ([_]) {

		return 0;
	}
	static keyboard_get_numlock ([_]) {

		return 0;
	}
	static keyboard_key_press ([_]) {

		return 0;
	}
	static keyboard_key_release ([_]) {

		return 0;
	}
	static keyboard_set_map ([_]) {

		return 0;
	}
	static keyboard_set_numlock ([_]) {

		return 0;
	}
	static keyboard_unset_map ([_]) {

		return 0;
	}
	static keyboard_wait ([_]) {

		return 0;
	}
	
	
	static load_info ([_]) {

		return 0;
	}
	
	static make_color ([_]) {

		return 0;
	}
	static make_color_hsv ([_]) {

		return 0;
	}
	
	static max3 ([_]) {

		return 0;
	}

	static median ([_]) {

		return 0;
	}
	static merge_color ([_]) {

		return 0;
	}
	static message_alpha ([_]) {

		return 0;
	}
	static message_background ([_]) {

		return 0;
	}
	static message_button ([_]) {

		return 0;
	}
	static message_button_font ([_]) {

		return 0;
	}
	static message_caption ([_]) {

		return 0;
	}
	static message_input_color ([_]) {

		return 0;
	}
	static message_input_font ([_]) {

		return 0;
	}
	static message_mouse_color ([_]) {

		return 0;
	}
	static message_position ([_]) {

		return 0;
	}
	static message_size ([_]) {

		return 0;
	}
	static message_text_font ([_]) {

		return 0;
	}
	static min3 ([_]) {

		return 0;
	}
	static motion_add ([_]) {

		return 0;
	}
	static motion_set ([_]) {

		return 0;
	}
	static mouse_check_button ([_]) {

		return 0;
	}
	static mouse_check_button_pressed ([_]) {

		return 0;
	}
	static mouse_check_button_released ([_]) {

		return 0;
	}
	static mouse_clear ([_]) {

		return 0;
	}
	static mouse_wait ([_]) {

		return 0;
	}
	static mouse_wheel_down ([_]) {

		return 0;
	}
	static mouse_wheel_up ([_]) {

		return 0;
	}
	static move_bounce ([_]) {

		return 0;
	}
	static move_bounce_all ([_]) {

		return 0;
	}
	static move_bounce_solid ([_]) {

		return 0;
	}
	static move_contact ([_]) {

		return 0;
	}
	static move_contact_all ([_]) {

		return 0;
	}
	static move_contact_solid ([_]) {

		return 0;
	}
	static move_outside_all ([_]) {

		return 0;
	}
	static move_outside_solid ([_]) {

		return 0;
	}
	static move_random ([_]) {

		return 0;
	}
	static move_random ([_]) {

		return 0;
	}
	static move_wrap ([_]) {

		return 0;
	}
	static mp_grid_add_cell ([_]) {

		return 0;
	}
	static mp_grid_add_instances ([_]) {

		return 0;
	}
	static mp_grid_add_rectangle ([_]) {

		return 0;
	}
	static mp_grid_clear_all ([_]) {

		return 0;
	}
	static mp_grid_clear_cell ([_]) {

		return 0;
	}
	static mp_grid_clear_rectangle ([_]) {

		return 0;
	}
	static mp_grid_create ([_]) {

		return 0;
	}
	static mp_grid_destroy ([_]) {

		return 0;
	}
	static mp_grid_draw ([_]) {

		return 0;
	}
	static mp_grid_path ([_]) {

		return 0;
	}
	static mp_linear_path ([_]) {

		return 0;
	}
	static mp_linear_path_object ([_]) {

		return 0;
	}
	static mp_linear_step ([_]) {

		return 0;
	}
	static mp_linear_step_object ([_]) {

		return 0;
	}
	static mp_potential_path ([_]) {

		return 0;
	}
	static mp_potential_path_object ([_]) {

		return 0;
	}
	static mp_potential_settings ([_]) {

		return 0;
	}
	static mp_potential_step ([_]) {

		return 0;
	}
	static mp_potential_step_object ([_]) {

		return 0;
	}
	static mplay_connect_status ([_]) {

		return 0;
	}
	static mplay_data_mode ([_]) {

		return 0;
	}
	static mplay_data_read ([_]) {

		return 0;
	}
	static mplay_data_write ([_]) {

		return 0;
	}
	static mplay_end ([_]) {

		return 0;
	}
	static mplay_init_ipx ([_]) {

		return 0;
	}
	static mplay_init_modem ([_]) {

		return 0;
	}
	static mplay_init_serial ([_]) {

		return 0;
	}
	static mplay_init_tcpip ([_]) {

		return 0;
	}
	static mplay_ipaddress ([_]) {

		return 0;
	}
	static mplay_message_clear ([_]) {

		return 0;
	}
	static mplay_message_count ([_]) {

		return 0;
	}
	static mplay_message_id ([_]) {

		return 0;
	}
	static mplay_message_name ([_]) {

		return 0;
	}
	static mplay_message_player ([_]) {

		return 0;
	}
	static mplay_message_receive ([_]) {

		return 0;
	}
	static mplay_message_send ([_]) {

		return 0;
	}
	static mplay_message_send_guaranteed ([_]) {

		return 0;
	}
	static mplay_message_value ([_]) {

		return 0;
	}
	static mplay_player_find ([_]) {

		return 0;
	}
	static mplay_player_id ([_]) {

		return 0;
	}
	static mplay_player_name ([_]) {

		return 0;
	}
	static mplay_session_create ([_]) {

		return 0;
	}
	static mplay_session_end ([_]) {

		return 0;
	}
	static mplay_session_find ([_]) {

		return 0;
	}
	static mplay_session_join ([_]) {

		return 0;
	}
	static mplay_session_mode ([_]) {

		return 0;
	}
	static mplay_session_name ([_]) {

		return 0;
	}
	static mplay_session_status ([_]) {

		return 0;
	}
	static object_add ([_]) {

		return 0;
	}
	static object_delete ([_]) {

		return 0;
	}
	static object_event_add ([_]) {

		return 0;
	}
	static object_event_clear ([_]) {

		return 0;
	}
	static object_exists ([_]) {

		return 0;
	}
	static object_get_depth ([_]) {

		return 0;
	}
	static object_get_mask ([_]) {

		return 0;
	}
	static object_get_name ([_]) {

		return 0;
	}
	static object_get_parent ([_]) {

		return 0;
	}
	static object_get_persistent ([_]) {

		return 0;
	}
	static object_get_solid ([_]) {

		return 0;
	}
	static object_get_sprite ([_]) {

		return 0;
	}
	static object_get_visible ([_]) {

		return 0;
	}
	static object_is_ancestor ([_]) {

		return 0;
	}
	static object_name ([_]) {

		return 0;
	}
	static object_set_depth ([_]) {

		return 0;
	}
	static object_set_mask ([_]) {

		return 0;
	}
	static object_set_parent ([_]) {

		return 0;
	}
	static object_set_persistent ([_]) {

		return 0;
	}
	static object_set_solid ([_]) {

		return 0;
	}
	static object_set_sprite ([_]) {

		return 0;
	}
	static object_set_visible ([_]) {

		return 0;
	}
	static parameter_count ([_]) {

		return 0;
	}
	static parameter_string ([_]) {

		return 0;
	}
	static part_attractor_clear ([_]) {

		return 0;
	}
	static part_attractor_create ([_]) {

		return 0;
	}
	static part_attractor_destroy ([_]) {

		return 0;
	}
	static part_attractor_destroy_all ([_]) {

		return 0;
	}
	static part_attractor_exists ([_]) {

		return 0;
	}
	static part_attractor_force ([_]) {

		return 0;
	}
	static part_attractor_position ([_]) {

		return 0;
	}
	static part_changer_clear ([_]) {

		return 0;
	}
	static part_changer_create ([_]) {

		return 0;
	}
	static part_changer_destroy ([_]) {

		return 0;
	}
	static part_changer_destroy_all ([_]) {

		return 0;
	}
	static part_changer_exists ([_]) {

		return 0;
	}
	static part_changer_kind ([_]) {

		return 0;
	}
	static part_changer_region ([_]) {

		return 0;
	}
	static part_changer_types ([_]) {

		return 0;
	}
	static part_deflector_clear ([_]) {

		return 0;
	}
	static part_deflector_create ([_]) {

		return 0;
	}
	static part_deflector_destroy ([_]) {

		return 0;
	}
	static part_deflector_destroy_all ([_]) {

		return 0;
	}
	static part_deflector_exists ([_]) {

		return 0;
	}
	static part_deflector_friction ([_]) {

		return 0;
	}
	static part_deflector_kind ([_]) {

		return 0;
	}
	static part_deflector_region ([_]) {

		return 0;
	}
	static part_destroyer_clear ([_]) {

		return 0;
	}
	static part_destroyer_create ([_]) {

		return 0;
	}
	static part_destroyer_destroy ([_]) {

		return 0;
	}
	static part_destroyer_destroy_all ([_]) {

		return 0;
	}
	static part_destroyer_exists ([_]) {

		return 0;
	}
	static part_destroyer_region ([_]) {

		return 0;
	}
	static part_emitter_burst ([_]) {

		return 0;
	}
	static part_emitter_clear ([_]) {

		return 0;
	}
	static part_emitter_create ([_]) {

		return 0;
	}
	static part_emitter_destroy ([_]) {

		return 0;
	}
	static part_emitter_destroy_all ([_]) {

		return 0;
	}
	static part_emitter_exists ([_]) {

		return 0;
	}
	static part_emitter_region ([_]) {

		return 0;
	}
	static part_emitter_stream ([_]) {

		return 0;
	}
	static part_particles_clear ([_]) {

		return 0;
	}
	static part_particles_count ([_]) {

		return 0;
	}
	static part_particles_create ([_]) {

		return 0;
	}
	static part_particles_create_color ([_]) {

		return 0;
	}
	static part_system_automatic_draw ([_]) {

		return 0;
	}
	static part_system_automatic_update ([_]) {

		return 0;
	}
	static part_system_clear ([_]) {

		return 0;
	}
	static part_system_create ([_]) {

		return 0;
	}
	static part_system_depth ([_]) {

		return 0;
	}
	static part_system_destroy ([_]) {

		return 0;
	}
	static part_system_draw_order ([_]) {

		return 0;
	}
	static part_system_drawit ([_]) {

		return 0;
	}
	static part_system_exists ([_]) {

		return 0;
	}
	static part_system_position ([_]) {

		return 0;
	}
	static part_system_update ([_]) {

		return 0;
	}
	static part_type_alpha ([_]) {

		return 0;
	}
	static part_type_alpha1 ([_]) {

		return 0;
	}
	static part_type_alpha2 ([_]) {

		return 0;
	}
	static part_type_alpha3 ([_]) {

		return 0;
	}
	static part_type_blend ([_]) {

		return 0;
	}
	static part_type_clear ([_]) {

		return 0;
	}
	static part_type_color ([_]) {

		return 0;
	}
	static part_type_color1 ([_]) {

		return 0;
	}
	static part_type_color2 ([_]) {

		return 0;
	}
	static part_type_color3 ([_]) {

		return 0;
	}
	static part_type_color_hsv ([_]) {

		return 0;
	}
	static part_type_color_mix ([_]) {

		return 0;
	}
	static part_type_color_rgb ([_]) {

		return 0;
	}
	static part_type_create ([_]) {

		return 0;
	}
	static part_type_death ([_]) {

		return 0;
	}
	static part_type_destroy ([_]) {

		return 0;
	}
	static part_type_direction ([_]) {

		return 0;
	}
	static part_type_exists ([_]) {

		return 0;
	}
	static part_type_gravity ([_]) {

		return 0;
	}
	static part_type_life ([_]) {

		return 0;
	}
	static part_type_orientation ([_]) {

		return 0;
	}
	static part_type_scale ([_]) {

		return 0;
	}
	static part_type_shape ([_]) {

		return 0;
	}
	static part_type_size ([_]) {

		return 0;
	}
	static part_type_speed ([_]) {

		return 0;
	}
	static part_type_sprite ([_]) {

		return 0;
	}
	static part_type_step ([_]) {

		return 0;
	}
	static path_add ([_]) {

		return 0;
	}
	static path_add_point ([_]) {

		return 0;
	}
	static path_append ([_]) {

		return 0;
	}
	static path_assign ([_]) {

		return 0;
	}
	static path_change_point ([_]) {

		return 0;
	}
	static path_clear_points ([_]) {

		return 0;
	}
	static path_delete ([_]) {

		return 0;
	}
	static path_delete_point ([_]) {

		return 0;
	}
	static path_duplicate ([_]) {

		return 0;
	}
	static path_end ([_]) {

		return 0;
	}
	static path_exists ([_]) {

		return 0;
	}
	static path_flip ([_]) {

		return 0;
	}
	static path_get_closed ([_]) {

		return 0;
	}
	static path_get_kind ([_]) {

		return 0;
	}
	static path_get_length ([_]) {

		return 0;
	}
	static path_get_name ([_]) {

		return 0;
	}
	static path_get_number ([_]) {

		return 0;
	}
	static path_get_point_speed ([_]) {

		return 0;
	}
	static path_get_point_x ([_]) {

		return 0;
	}
	static path_get_point_y ([_]) {

		return 0;
	}
	static path_get_precision ([_]) {

		return 0;
	}
	static path_get_speed ([_]) {

		return 0;
	}
	static path_get_x ([_]) {

		return 0;
	}
	static path_get_y ([_]) {

		return 0;
	}
	static path_insert_point ([_]) {

		return 0;
	}
	static path_mirror ([_]) {

		return 0;
	}
	static path_name ([_]) {

		return 0;
	}
	static path_reverse ([_]) {

		return 0;
	}
	static path_rotate ([_]) {

		return 0;
	}
	static path_scale ([_]) {

		return 0;
	}
	static path_set_closed ([_]) {

		return 0;
	}
	static path_set_kind ([_]) {

		return 0;
	}
	static path_set_precision ([_]) {

		return 0;
	}
	static path_shift ([_]) {

		return 0;
	}
	static path_start ([_]) {

		return 0;
	}
	static place_empty ([_]) {

		return 0;
	}
	static place_free ([_]) {

		return 0;
	}
	static place_meeting ([_]) {

		return 0;
	}
	static position_change ([_]) {

		return 0;
	}
	static position_destroy ([_]) {

		return 0;
	}
	static position_empty ([_]) {

		return 0;
	}
	static position_meeting ([_]) {

		return 0;
	}
	
	static random_get_seed ([_]) {

		return 0;
	}
	
	static random_set_seed ([_]) {

		return 0;
	}
	static randomize ([_]) {

		return 0;
	}
	
	static registry_exists ([_]) {

		return 0;
	}
	static registry_exists_ext ([_]) {

		return 0;
	}
	static registry_read_real ([_]) {

		return 0;
	}
	static registry_read_real_ext ([_]) {

		return 0;
	}
	static registry_read_string ([_]) {

		return 0;
	}
	static registry_read_string_ext ([_]) {

		return 0;
	}
	static registry_set_root ([_]) {

		return 0;
	}
	static registry_write_real ([_]) {

		return 0;
	}
	static registry_write_real_ext ([_]) {

		return 0;
	}
	static registry_write_string ([_]) {

		return 0;
	}
	static registry_write_string_ext ([_]) {

		return 0;
	}
	static room_add ([_]) {

		return 0;
	}
	static room_assign ([_]) {

		return 0;
	}
	static room_duplicate ([_]) {

		return 0;
	}
	static room_exists ([_]) {

		return 0;
	}
	static room_get_name ([_]) {

		return 0;
	}
	static room_goto_next ([_]) {

		return 0;
	}
	static room_goto_previous ([_]) {

		return 0;
	}
	static room_instance_add ([_]) {

		return 0;
	}
	static room_instance_clear ([_]) {

		return 0;
	}
	static room_name ([_]) {

		return 0;
	}
	static room_next ([_]) {

		return 0;
	}
	static room_previous ([_]) {

		return 0;
	}
	static room_restart ([_]) {

		return 0;
	}
	static room_set_background ([_]) {

		return 0;
	}
	static room_set_background_color ([_]) {

		return 0;
	}
	static room_set_caption ([_]) {

		return 0;
	}
	static room_set_code ([_]) {

		return 0;
	}
	static room_set_height ([_]) {

		return 0;
	}
	static room_set_persistent ([_]) {

		return 0;
	}
	static room_set_view ([_]) {

		return 0;
	}
	static room_set_view_enabled ([_]) {

		return 0;
	}
	static room_set_width ([_]) {

		return 0;
	}
	static room_tile_add ([_]) {

		return 0;
	}
	static room_tile_add_ext ([_]) {

		return 0;
	}
	static room_tile_clear ([_]) {

		return 0;
	}
	static screen_redraw ([_]) {

		return 0;
	}
	static screen_refresh ([_]) {

		return 0;
	}
	static screen_save ([_]) {

		return 0;
	}
	static screen_save_part ([_]) {

		return 0;
	}
	static screen_wait_vsync ([_]) {

		return 0;
	}
	static script_execute ([_]) {

		return 0;
	}
	static script_exists ([_]) {

		return 0;
	}
	static script_get_name ([_]) {

		return 0;
	}
	static script_get_text ([_]) {

		return 0;
	}
	static script_name ([_]) {

		return 0;
	}
	static set_application_title ([_]) {

		return 0;
	}
	static set_automatic_draw ([_]) {

		return 0;
	}
	static set_program_priority ([_]) {

		return 0;
	}
	static set_synchronization ([_]) {

		return 0;
	}
	static show_debug_message ([_]) {

		return 0;
	}
	static show_error ([_]) {

		return 0;
	}
	static show_image ([_]) {

		return 0;
	}
	static show_info ([_]) {

		return 0;
	}
	static show_menu ([_]) {

		return 0;
	}
	static show_menu_pos ([_]) {

		return 0;
	}
	static show_message_ext ([_]) {

		return 0;
	}
	static show_question ([_]) {

		return 0;
	}
	static show_text ([_]) {

		return 0;
	}
	static show_video ([_]) {

		return 0;
	}
	static sleep ([_]) {

		return 0;
	}
	static sound_3d_set_sound_cone ([_]) {

		return 0;
	}
	static sound_3d_set_sound_distance ([_]) {

		return 0;
	}
	static sound_3d_set_sound_position ([_]) {

		return 0;
	}
	static sound_3d_set_sound_velocity ([_]) {

		return 0;
	}
	static sound_add ([_]) {

		return 0;
	}
	static sound_background_tempo ([_]) {

		return 0;
	}
	static sound_delete ([_]) {

		return 0;
	}
	static sound_discard ([_]) {

		return 0;
	}
	static sound_effect_chorus ([_]) {

		return 0;
	}
	static sound_effect_compressor ([_]) {

		return 0;
	}
	static sound_effect_echo ([_]) {

		return 0;
	}
	static sound_effect_equalizer ([_]) {

		return 0;
	}
	static sound_effect_flanger ([_]) {

		return 0;
	}
	static sound_effect_gargle ([_]) {

		return 0;
	}
	static sound_effect_reverb ([_]) {

		return 0;
	}
	static sound_effect_set ([_]) {

		return 0;
	}
	static sound_exists ([_]) {

		return 0;
	}
	static sound_fade ([_]) {

		return 0;
	}
	static sound_get_kind ([_]) {

		return 0;
	}
	static sound_get_name ([_]) {

		return 0;
	}
	static sound_get_preload ([_]) {

		return 0;
	}
	static sound_global_volume ([_]) {

		return 0;
	}
	static sound_isplaying ([_]) {

		return 0;
	}
	static sound_loop ([_]) {

		return 0;
	}
	static sound_name ([_]) {

		return 0;
	}
	static sound_pan ([_]) {

		return 0;
	}
	static sound_play ([_]) {

		return 0;
	}
	static sound_replace ([_]) {

		return 0;
	}
	static sound_restore ([_]) {

		return 0;
	}
	static sound_set_search_directory ([_]) {

		return 0;
	}
	static sound_stop ([_]) {

		return 0;
	}
	static sound_stop_all ([_]) {

		return 0;
	}
	static sound_volume ([_]) {

		return 0;
	}
	static splash_set_adapt ([_]) {

		return 0;
	}
	static splash_set_border ([_]) {

		return 0;
	}
	static splash_set_caption ([_]) {

		return 0;
	}
	static splash_set_close_button ([_]) {

		return 0;
	}
	static splash_set_color ([_]) {

		return 0;
	}
	static splash_set_cursor ([_]) {

		return 0;
	}
	static splash_set_fullscreen ([_]) {

		return 0;
	}
	static splash_set_interrupt ([_]) {

		return 0;
	}
	static splash_set_main ([_]) {

		return 0;
	}
	static splash_set_position ([_]) {

		return 0;
	}
	static splash_set_scale ([_]) {

		return 0;
	}
	static splash_set_size ([_]) {

		return 0;
	}
	static splash_set_stop_key ([_]) {

		return 0;
	}
	static splash_set_stop_mouse ([_]) {

		return 0;
	}
	static splash_set_top ([_]) {

		return 0;
	}
	static splash_show_image ([_]) {

		return 0;
	}
	static splash_show_text ([_]) {

		return 0;
	}
	static splash_show_video ([_]) {

		return 0;
	}
	static splash_show_web ([_]) {

		return 0;
	}
	static sprite_add ([_]) {

		return 0;
	}
	static sprite_add_from_screen ([_]) {

		return 0;
	}
	static sprite_add_from_surface ([_]) {

		return 0;
	}
	static sprite_add_sprite ([_]) {

		return 0;
	}
	static sprite_assign ([_]) {

		return 0;
	}
	static sprite_collision_mask ([_]) {

		return 0;
	}
	static sprite_create_from_screen ([_]) {

		return 0;
	}
	static sprite_create_from_surface ([_]) {

		return 0;
	}
	static sprite_delete ([_]) {

		return 0;
	}
	static sprite_duplicate ([_]) {

		return 0;
	}
	static sprite_exists ([_]) {

		return 0;
	}
	static sprite_get_bbox_bottom ([_]) {

		return 0;
	}
	static sprite_get_bbox_left ([_]) {

		return 0;
	}
	static sprite_get_bbox_right ([_]) {

		return 0;
	}
	static sprite_get_bbox_top ([_]) {

		return 0;
	}
	static sprite_get_height ([_]) {

		return 0;
	}
	static sprite_get_name ([_]) {

		return 0;
	}
	static sprite_get_number ([_]) {

		return 0;
	}
	static sprite_get_texture ([_]) {

		return 0;
	}
	static sprite_get_width ([_]) {

		return 0;
	}
	static sprite_get_xoffset ([_]) {

		return 0;
	}
	static sprite_get_yoffset ([_]) {

		return 0;
	}
	static sprite_merge ([_]) {

		return 0;
	}
	static sprite_name ([_]) {

		return 0;
	}
	static sprite_replace ([_]) {

		return 0;
	}
	static sprite_replace_sprite ([_]) {

		return 0;
	}
	static sprite_save ([_]) {

		return 0;
	}
	static sprite_save_strip ([_]) {

		return 0;
	}
	static sprite_set_alpha_from_sprite ([_]) {

		return 0;
	}
	static sprite_set_offset ([_]) {

		return 0;
	}
	static string_char_at ([_]) {

		return 0;
	}
	static string_copy ([_]) {

		return 0;
	}
	static string_count ([_]) {

		return 0;
	}
	static string_delete ([_]) {

		return 0;
	}
	static string_digits ([_]) {

		return 0;
	}
	static string_format ([_]) {

		return 0;
	}
	static string_height ([_]) {

		return 0;
	}
	static string_height_ext ([_]) {

		return 0;
	}
	static string_insert ([_]) {

		return 0;
	}
	static string_length ([_]) {

		return 0;
	}
	static string_letters ([_]) {

		return 0;
	}
	static string_lettersdigits ([_]) {

		return 0;
	}
	static string_lower ([_]) {

		return 0;
	}
	static string_pos ([_]) {

		return 0;
	}
	static string_repeat ([_]) {

		return 0;
	}
	static string_replace ([_]) {

		return 0;
	}
	static string_replace_all ([_]) {

		return 0;
	}
	static string_upper ([_]) {

		return 0;
	}
	static string_width ([_]) {

		return 0;
	}
	static string_width_ext ([_]) {

		return 0;
	}
	static surface_copy ([_]) {

		return 0;
	}
	static surface_copy_part ([_]) {

		return 0;
	}
	static surface_create ([_]) {

		return 0;
	}
	static surface_exists ([_]) {

		return 0;
	}
	static surface_free ([_]) {

		return 0;
	}
	static surface_get_height ([_]) {

		return 0;
	}
	static surface_get_texture ([_]) {

		return 0;
	}
	static surface_get_width ([_]) {

		return 0;
	}
	static surface_getpixel ([_]) {

		return 0;
	}
	static surface_reset_target ([_]) {

		return 0;
	}
	static surface_save ([_]) {

		return 0;
	}
	static surface_save_part ([_]) {

		return 0;
	}
	static surface_set_target ([_]) {

		return 0;
	}
	static texture_exists ([_]) {

		return 0;
	}
	static texture_get_height ([_]) {

		return 0;
	}
	static texture_get_width ([_]) {

		return 0;
	}
	static texture_preload ([_]) {

		return 0;
	}
	static texture_set_blending ([_]) {

		return 0;
	}
	static texture_set_interpolation ([_]) {

		return 0;
	}
	static texture_set_priority ([_]) {

		return 0;
	}
	static texture_set_repeat ([_]) {

		return 0;
	}
	static tile_add ([_]) {

		return 0;
	}
	static tile_delete ([_]) {

		return 0;
	}
	static tile_delete_at ([_]) {

		return 0;
	}
	static tile_exists ([_]) {

		return 0;
	}
	static tile_find ([_]) {

		return 0;
	}
	static tile_get_alpha ([_]) {

		return 0;
	}
	static tile_get_background ([_]) {

		return 0;
	}
	static tile_get_blend ([_]) {

		return 0;
	}
	static tile_get_depth ([_]) {

		return 0;
	}
	static tile_get_height ([_]) {

		return 0;
	}
	static tile_get_left ([_]) {

		return 0;
	}
	static tile_get_top ([_]) {

		return 0;
	}
	static tile_get_visible ([_]) {

		return 0;
	}
	static tile_get_width ([_]) {

		return 0;
	}
	static tile_get_x ([_]) {

		return 0;
	}
	static tile_get_xscale ([_]) {

		return 0;
	}
	static tile_get_y ([_]) {

		return 0;
	}
	static tile_get_yscale ([_]) {

		return 0;
	}
	static tile_layer_delete ([_]) {

		return 0;
	}
	static tile_layer_delete_at ([_]) {

		return 0;
	}
	static tile_layer_depth ([_]) {

		return 0;
	}
	static tile_layer_find ([_]) {

		return 0;
	}
	static tile_layer_hide ([_]) {

		return 0;
	}
	static tile_layer_shift ([_]) {

		return 0;
	}
	static tile_layer_show ([_]) {

		return 0;
	}
	static tile_set_alpha ([_]) {

		return 0;
	}
	static tile_set_background ([_]) {

		return 0;
	}
	static tile_set_blend ([_]) {

		return 0;
	}
	static tile_set_depth ([_]) {

		return 0;
	}
	static tile_set_position ([_]) {

		return 0;
	}
	static tile_set_region ([_]) {

		return 0;
	}
	static tile_set_scale ([_]) {

		return 0;
	}
	static tile_set_visible ([_]) {

		return 0;
	}
	static timeline_add ([_]) {

		return 0;
	}
	static timeline_clear ([_]) {

		return 0;
	}
	static timeline_delete ([_]) {

		return 0;
	}
	static timeline_exists ([_]) {

		return 0;
	}
	static timeline_get_name ([_]) {

		return 0;
	}
	static timeline_moment_add ([_]) {

		return 0;
	}
	static timeline_moment_clear ([_]) {

		return 0;
	}
	static timeline_name ([_]) {

		return 0;
	}
	static transition_define ([_]) {

		return 0;
	}
	static transition_exists ([_]) {

		return 0;
	}
	static variable_global_array2_get ([_]) {

		return 0;
	}
	static variable_global_array2_set ([_]) {

		return 0;
	}
	static variable_global_array_get ([_]) {

		return 0;
	}
	static variable_global_array_set ([_]) {

		return 0;
	}
	static variable_global_exists ([_]) {

		return 0;
	}
	static variable_global_get ([_]) {

		return 0;
	}
	static variable_global_set ([_]) {

		return 0;
	}
	static variable_local_array2_get ([_]) {

		return 0;
	}
	static variable_local_array2_set ([_]) {

		return 0;
	}
	static variable_local_array_get ([_]) {

		return 0;
	}
	static variable_local_array_set ([_]) {

		return 0;
	}
	static variable_local_exists ([_]) {

		return 0;
	}
	static variable_local_get ([_]) {

		return 0;
	}
	static variable_local_set ([_]) {

		return 0;
	}
	static window_center ([_]) {

		return 0;
	}
	static window_default ([_]) {

		return 0;
	}
	static window_get_caption ([_]) {

		return 0;
	}
	static window_get_color ([_]) {

		return 0;
	}
	static window_get_cursor ([_]) {

		return 0;
	}
	static window_get_fullscreen ([_]) {

		return 0;
	}
	static window_get_height ([_]) {

		return 0;
	}
	static window_get_region_height ([_]) {

		return 0;
	}
	static window_get_region_scale ([_]) {

		return 0;
	}
	static window_get_region_width ([_]) {

		return 0;
	}
	static window_get_showborder ([_]) {

		return 0;
	}
	static window_get_showicons ([_]) {

		return 0;
	}
	static window_get_sizeable ([_]) {

		return 0;
	}
	static window_get_stayontop ([_]) {

		return 0;
	}
	static window_get_visible ([_]) {

		return 0;
	}
	static window_get_width ([_]) {

		return 0;
	}
	static window_get_x ([_]) {

		return 0;
	}
	static window_get_y ([_]) {

		return 0;
	}
	static window_handle ([_]) {

		return 0;
	}
	static window_mouse_get_x ([_]) {

		return 0;
	}
	static window_mouse_get_y ([_]) {

		return 0;
	}
	static window_mouse_set ([_]) {

		return 0;
	}
	static window_set_caption ([_]) {

		return 0;
	}
	static window_set_color ([_]) {

		return 0;
	}
	static window_set_cursor ([_]) {

		return 0;
	}
	static window_set_fullscreen ([_]) {

		return 0;
	}
	static window_set_position ([_]) {

		return 0;
	}
	static window_set_rectangle ([_]) {

		return 0;
	}
	static window_set_region_scale ([_]) {

		return 0;
	}
	static window_set_region_size ([_]) {

		return 0;
	}
	static window_set_showborder ([_]) {

		return 0;
	}
	static window_set_showicons ([_]) {

		return 0;
	}
	static window_set_size ([_]) {

		return 0;
	}
	static window_set_sizeable ([_]) {

		return 0;
	}
	static window_set_stayontop ([_]) {

		return 0;
	}
	static window_set_visible ([_]) {

		return 0;
	}
	static window_view_mouse_get_x ([_]) {

		return 0;
	}
	static window_view_mouse_get_y ([_]) {

		return 0;
	}
	static window_view_mouse_set ([_]) {

		return 0;
	}
	static window_views_mouse_get_x ([_]) {

		return 0;
	}
	static window_views_mouse_get_y ([_]) {

		return 0;
	}
	static window_views_mouse_set ([_]) {

		return 0;
	}

}