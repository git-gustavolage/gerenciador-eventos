<?php

use App\Http\Controllers\AmbienteController;
use App\Http\Controllers\AtividadeController;
use App\Http\Controllers\CertificadoController;
use App\Http\Controllers\CertificadoTemplateController;
use App\Http\Controllers\ConviteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InscricaoAtividadeController;
use App\Http\Controllers\InscricaoController;
use App\Http\Controllers\MinistranteController;
use App\Http\Controllers\OrganizacaoController;
use App\Http\Controllers\OrganizadoresController;
use App\Http\Controllers\ParticipanteController;
use App\Http\Controllers\ProfileController;
use App\Models\Evento;
use App\Support\S3Manager;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'view'])->name('home');

Route::get('/eventos/explorar', [EventoController::class, 'view'])->name('eventos.explorar');

Route::get('/eventos/show/{id}', [EventoController::class, 'show'])->name('eventos.publico.show');

Route::get('/midia/{path}', fn (string $path) => S3Manager::get($path, 'imagem'))->name('midia')->where('path', '.*');

Route::get('/api/eventos/publicos', function () {
    return Evento::with(['local'])->where('is_publicado', true)->where('is_cancelado', false)->orderBy('data_inicio', 'asc')->get();
})->name('api.eventos.publicos');

Route::middleware('auth')->group(function () {
    Route::get('/certificados/meus', [CertificadoController::class, 'meusCertificados'])->name('certificados.meus');
    Route::get('/meus-eventos', [ParticipanteController::class, 'view'])->name('meus_eventos');
    Route::get('/dashboard', [DashboardController::class, 'view'])->name('dashboard')->middleware(['organizador']);

    Route::group(['prefix' => '/eventos', 'as' => 'eventos.', 'controller' => EventoController::class], function () {
        Route::get('/create', 'create')->name('create')->middleware(['admin']);
        Route::post('/store', 'store')->name('store')->middleware(['admin']);
        Route::put('/update', 'update')->name('update')->middleware(['organizador']);
        Route::patch('/cancel', 'cancel')->name('cancel')->middleware(['organizador']);;
        Route::patch('/publish', 'publish')->name('publish')->middleware(['organizador']);;

        Route::get('/minhas-atividades', [MinistranteController::class, 'minhasAtividades'])->name('ministrante.minhas-atividades');

        Route::group(['prefix' => '/organizacao', 'as' => 'organizacao.', 'middleware' => ['organizador']], function () {
            Route::get('/', [OrganizacaoController::class, 'view'])->name('view');
            Route::get('/evento', [OrganizacaoController::class, 'evento'])->name('evento');
            Route::get('/organizadores', [OrganizacaoController::class, 'organizadores'])->name('organizadores');
            Route::get('/ministrantes', [OrganizacaoController::class, 'ministrantes'])->name('ministrantes');
            Route::get('/programacao', [OrganizacaoController::class, 'programacao'])->name('programacao');

            Route::get('/inscricoes', [OrganizacaoController::class, 'inscricoes'])->name('inscricoes');
            Route::post('/inscricoes/confirmar-todas', [OrganizacaoController::class, 'confirmarTodas'])->name('confirmar-todas');
            Route::put('/inscricoes/{inscricaoEvento}/confirmar', [OrganizacaoController::class, 'confirmarInscricao'])->name('confirmar-inscricao');
            Route::put('/inscricoes/{inscricaoEvento}/cancelar', [OrganizacaoController::class, 'cancelarInscricao'])->name('cancelar-inscricao');
            Route::put('/inscricoes/{inscricaoEvento}/toggle-presenca', [OrganizacaoController::class, 'togglePresenca'])->name('toggle-presenca');

            Route::get('/atividades/{atividade}/inscricoes', [OrganizacaoController::class, 'inscricoesAtividade'])->name('atividades.inscricoes');
            Route::post('/atividades/{atividade}/inscricoes/confirmar-todas', [OrganizacaoController::class, 'confirmarTodasAtividade'])->name('atividades.confirmar-todas');
            Route::put('/atividades/inscricoes/{inscricaoAtividade}/confirmar', [OrganizacaoController::class, 'confirmarInscricaoAtividade'])->name('atividades.confirmar-inscricao');
            Route::put('/atividades/inscricoes/{inscricaoAtividade}/cancelar', [OrganizacaoController::class, 'cancelarInscricaoAtividade'])->name('atividades.cancelar-inscricao');
            Route::put('/atividades/inscricoes/{inscricaoAtividade}/toggle-presenca', [OrganizacaoController::class, 'togglePresencaAtividade'])->name('atividades.toggle-presenca');

            Route::group(['prefix' => '/certificados', 'as' => 'certificados.'], function () {
                // modelos de certificado
                Route::get('/', [CertificadoTemplateController::class, 'edit'])->name('edit');
                Route::post('/', [CertificadoTemplateController::class, 'store'])->name('store');
                Route::post('/{certificado}/fundo', [CertificadoTemplateController::class, 'uploadFundo'])->name('fundo');
                // Emissão
                Route::get('/emissao', [CertificadoController::class, 'emissao'])->name('emissao');
                Route::post('/issue', [CertificadoController::class, 'issue'])->name('issue');
                Route::post('/batch', [CertificadoController::class, 'issueBatch'])->name('batch');
                Route::get('/download/{id}', [CertificadoController::class, 'download'])->name('download');
            });
        });
    });

    Route::group(['prefix' => '/ministrantes', 'as' => 'ministrantes.', 'controller' => MinistranteController::class], function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{id}', 'update')->name('update');
        Route::delete('/{id}', 'destroy')->name('destroy');
    });

    Route::group(['prefix' => '/inscricoes', 'as' => 'inscricoes.', 'controller' => InscricaoController::class], function () {
        Route::post('/', 'store')->name('store');
        Route::group(['prefix' => '/atividades', 'as' => 'atividades.', 'controller' => InscricaoAtividadeController::class], function () {
            Route::post('/store', 'store')->name('store');
            Route::delete('/destroy', 'destroy')->name('destroy');
        });
    });

    Route::group(['prefix' => '/participantes', 'as' => 'participantes.', 'controller' => ParticipanteController::class], function () {
        Route::get('/evento/{id}', 'evento')->name('evento');
    });

    Route::get('/atividades', [AtividadeController::class, 'index'])->name('atividades.index');
    Route::post('/atividades', [AtividadeController::class, 'store'])->name('atividades.store');
    Route::put('/atividades/{id}', [AtividadeController::class, 'update'])->name('atividades.update');
    Route::put('/atividades/cancel/{id}', [AtividadeController::class, 'cancel'])->name('atividades.cancel');
    Route::post('/atividades/ministrantes/store', [AtividadeController::class, 'addMinistrante'])->name('atividades.ministrantes.store');
    Route::delete('/atividades/ministrantes/destroy', [AtividadeController::class, 'removeMinistrante'])->name('atividades.ministrantes.destroy');

    Route::group(['prefix' => '/organizadores', 'as' => 'organizadores.'], function () {
        Route::delete('/destoy/{id}', [OrganizadoresController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => '/ambientes', 'as' => 'ambientes.', 'controller' => AmbienteController::class], function () {
        Route::post('/store', 'store')->name('store');
    });

    Route::group(['prefix' => '/convites', 'as' => 'convites.', 'controller' => ConviteController::class], function () {
        Route::get('/handle/{token}', 'view')->name('view')->withoutMiddleware('auth');
        Route::get('/pending', 'pending')->name('pending');
        Route::post('/accept/{token}', 'accept')->name('accept');
        Route::post('/invite', 'invite')->name('invite');
        Route::delete('/cancel/{id}', 'cancel')->name('cancel');
    });

    Route::group(['prefix' => '/profile', 'as' => 'profile.', 'controller' => ProfileController::class], function () {
        Route::get('/profile', 'edit')->name('edit');
        Route::patch('/profile', 'update')->name('update');
        Route::delete('/profile', 'destroy')->name('destroy');
    });
});

require __DIR__.'/auth.php';
