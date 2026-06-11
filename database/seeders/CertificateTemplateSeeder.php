<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CertificateTemplateSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('certificate_templates')->insert([
            'id' => 1,
            'id_evento' => 1,
            'template_name' => 'Modelo Padrão',
            'background_path' => null,
            'fields' => '[{"id":"titulo","label":"Título","content":"CERTIFICADO DE PARTICIPAÇÃO","x":"561","y":"141","fontSize":"32","fontWeight":"bold","color":"#064e3b","align":"center","width":"1020"},{"id":"subtitulo","label":"Subtítulo","content":"Certificamos que","x":"561","y":"250","fontSize":"16","fontWeight":"normal","color":"#6b7280","align":"center","width":"900"},{"id":"nome","label":"Nome","content":"{{nome_participante}}","x":"561","y":"310","fontSize":"36","fontWeight":"bold","color":"#111827","align":"center","width":"900"},{"id":"corpo","label":"Corpo","content":"participou da atividade {{nome_atividade}} no evento {{nome_evento}},\r\ncom carga horária de {{carga_horaria}}.","x":"561","y":"400","fontSize":"16","fontWeight":"bold","color":"#374151","align":"center","width":"860"},{"id":"atividade","label":"Atividade","content":"Realizada em {{data_atividade}} das {{horario_atividade}}","x":"561","y":"480","fontSize":"14","fontWeight":"normal","color":"#6b7280","align":"center","width":"780"},{"id":"rodape","label":"Rodapé","content":"Emitido em {{data_emissao}}","x":"561","y":"665","fontSize":"12","fontWeight":"normal","color":"#9ca3af","align":"center","width":"400"}]',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}